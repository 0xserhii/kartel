import mongoose from "mongoose";
import { Namespace, Server, Socket, Event as SocketEvent } from "socket.io";
import { CGAME_STATES, ECrashGameEvents } from "../crash-game.constant";
import {
    IUpdateParams,
    TAutoCrashBetPayload,
    TJoinGamePayload,
} from "../crash-game.interface";
import { ESOCKET_NAMESPACE } from "@/constant/enum";
import logger from "@/utils/logger";
import { CrashGameSocketController } from "./crash-game.socket-controller";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TOKEN_SECRET } from "@/config";
import UserService from "@/modules/user/user.service";
import { CrashGameService } from "../crash-game.service";
import { AutoCrashBetService } from "@/modules/auto-crash-bet";
import { getCrashState } from "@/utils/setting/site";
import { getVipLevelFromWager } from "@/utils/customer/vip";
import { WalletTransactionService } from "@/modules/wallet-transaction";
import { IUserModel } from "@/modules/user/user.interface";

class CrashGameSocketListener {
    private rootSocketServer: Server;
    private socketServer: Namespace;
    private logoPrefix: string = "[Crash Game]::: ";
    private crashGameSocketController: CrashGameSocketController;
    private loggedIn = false;
    private user: IUserModel | null = null;
    private userService: UserService;
    private crashGameService: CrashGameService;
    private autoCrashBetService: AutoCrashBetService;
    private walletTransactionService: WalletTransactionService;

    constructor(socketServer: Server) {
        this.rootSocketServer = socketServer;
        this.socketServer = socketServer.of(ESOCKET_NAMESPACE.crash);

        this.crashGameSocketController = new CrashGameSocketController();
        this.crashGameSocketController.setSocketNamespace(this.socketServer);

        this.initializeListener();
        this.subscribeListener();
    }

    private subscribeListener(): void {
        this.socketServer.on("connection", (socket: Socket) => {
            this.initializeSubscribe(socket);
            // Auth handler
            socket.on(ECrashGameEvents.auth, async (token: string) => {
                this.authHandler(token, socket);
            });
            // Get Previous history handler
            socket.on(ECrashGameEvents.getHistory, async (count: number) => {
                this.getHistoryHandler(count, socket);
            });
            // Auto Crash Bet Handler
            socket.on(
                ECrashGameEvents.autoCrashBet,
                async (data: TAutoCrashBetPayload) => {
                    this.autoCrashBetHandler(data, socket);
                }
            );
            // Cancel Auto Crash Bet Handler
            socket.on(ECrashGameEvents.cancelAutoBet, async () => {
                this.cancelAutoBetHandler(socket);
            });
            // Cashout the current bet Handler
            socket.on(ECrashGameEvents.joinGame, async (data: TJoinGamePayload) => {
                this.joinGameHandler(data, socket);
            });
            // Cashout the current bet Handler
            socket.on(ECrashGameEvents.betCashout, async () => {
                this.betCashoutHandler(socket);
            });
            // Disconnect Handler
            socket.on(ECrashGameEvents.disconnect, async () => {
                this.disconnectHandler(socket);
            });

            // Check for users ban status
            socket.use((packet: SocketEvent, next: (err?: any) => void) =>
                this.banStatusCheckMiddleware(packet, next, socket)
            );
        });
    }

    private initializeListener = async () => {
        try {
            await this.initGame();
            await this.runGame();
        } catch (error) {
            logger.error(this.logoPrefix + "Error initializing game:", error);
        }
    };

    private initializeSubscribe = async (socket: Socket) => { };

    private banStatusCheckMiddleware = async (
        packet: SocketEvent,
        next: (err?: any) => void,
        socket: Socket
    ) => {
        if (this.loggedIn && this.user) {
            try {
                const dbUser = await this.userService.getItem({ _id: this.user._id });

                // Check if user is banned
                if (dbUser && parseInt(dbUser.banExpires) > new Date().getTime()) {
                    return socket.emit("user banned");
                } else {
                    return next();
                }
            } catch (error) {
                return socket.emit("user banned");
            }
        } else {
            return next();
        }
    };

    private authHandler = async (token: string, socket: Socket) => {
        if (!token) {
            this.loggedIn = false;
            this.user = null;
            return socket.emit(
                "error",
                "No authentication token provided, authorization declined"
            );
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, TOKEN_SECRET) as JwtPayload;

            const user = await this.userService.getItem({ _id: decoded.userId });

            if (user) {
                if (parseInt(user.banExpires) > new Date().getTime()) {
                    this.loggedIn = false;
                    this.user = null;
                    return socket.emit("user banned");
                } else {
                    this.loggedIn = true;
                    socket.join(String(user._id));
                    this.crashGameSocketController.gameStatus.connectedUsers[
                        user._id.toString()
                    ] = socket;
                    // socket.emit("notify-success", "Successfully authenticated!");
                }
            }
            // return socket.emit("alert success", "Socket Authenticated!");
        } catch (error) {
            this.loggedIn = false;
            console.log("error handle", error);
            this.user = null;
            return socket.emit("notify-error", "Authentication token is not valid");
        }
    };

    private getHistoryHandler = async (count: number, socket: Socket) => {
        try {
            // Get the most recent documents with status 4, limited by the count parameter
            const history = await this.crashGameService.aggregateByPipeline([
                { $match: { status: 4 } },
                { $sort: { createdAt: -1 } },
                { $limit: count },
                { $project: { _id: 1, players: 1, crashPoint: 1 } },
            ]);
            socket.emit("previous-crashgame-history", history);
        } catch (error) {
            console.error("Error fetching previous crash game history:", error);
            socket.emit(
                "notify-error",
                "Error occurred when fetching previous crash game history!"
            );
        }
    };

    private autoCrashBetHandler = async (
        count: TAutoCrashBetPayload,
        socket: Socket
    ) => {
        async (data: {
            betAmount: number;
            cashoutPoint: number;
            count: number;
            denom: string;
        }) => {
            if (!this.loggedIn)
                return socket.emit("bet-cashout-error", "You are not logged in!");
            try {
                const { betAmount, cashoutPoint, count, denom } = data;
                const userId = this.user!._id.toString();
                const dbUser = await this.userService.getItem({ _id: userId });
                if (dbUser!.selfExcludes.crash > Date.now()) {
                    return socket.emit(
                        "game-join-error",
                        "You have self-excluded yourself for another 1 hour!"
                    );
                }
                const bet = await this.autoCrashBetService.getItem({ user: userId });
                if (bet && bet.status && bet.count > 0) {
                    return socket.emit(
                        "game-join-error",
                        "You already have a bet in progress!"
                    );
                }
                await this.autoCrashBetService.create({
                    user: new mongoose.Types.ObjectId(userId),
                    betAmount,
                    cashoutPoint,
                    count,
                    status: true,
                    denom: denom,
                });
                return socket.emit(
                    "auto-crashgame-join-success",
                    "Autobet will begin with the next round."
                );
            } catch (error) {
                console.error("autoCrashBet >>>", error);
                return socket.emit(
                    "notify-error",
                    "There was an error while placing your autobet."
                );
            }
        };
    };

    private cancelAutoBetHandler = async (socket: Socket) => {
        try {
            if (!this.loggedIn)
                return socket.emit("notify-error", "You are not logged in!");
            const userId = this.user!._id.toString();
            const bet = await this.autoCrashBetService.getItem({ user: userId });
            if (bet) {
                await this.autoCrashBetService.delete({ _id: bet._id });
                return socket.emit(
                    "auto-crashgame-join-success",
                    "Autobet has been canceled."
                    // 'Autobet has been canceled, effective from the next round.'
                );
            }
        } catch (error) {
            console.error("cancelAutoBet >>>", error);
            return socket.emit(
                "notify-error",
                "There was an error while canceling your autobet."
            );
        }
    };

    private betCashoutHandler = async (socket: Socket) => {
        if (!this.loggedIn)
            return socket.emit("bet-cashout-error", "You are not logged in!");

        // Check if game is running
        if (
            this.crashGameSocketController.gameStatus.status !==
            CGAME_STATES.InProgress
        )
            return socket.emit("bet-cashout-error", "There is no game in progress!");

        // Calculate the current multiplier
        const elapsed =
            Date.now() -
            this.crashGameSocketController.gameStatus.startedAt!.getTime();
        let at = this.crashGameSocketController.growthFunc(elapsed);

        // Check if cashout is over 1x
        if (at < 101)
            return socket.emit("bet-cashout-error", "The minimum cashout is 1.01x!");

        // Find bet from state
        const bet =
            this.crashGameSocketController.gameStatus.players[this.user!._id.toString()];

        // Check if bet exists
        if (!bet) return socket.emit("bet-cashout-error", "Coudn't find your bet!");

        // Check if the current multiplier is over the auto cashout
        if (bet.autoCashOut > 100 && bet.autoCashOut <= at) {
            at = bet.autoCashOut;
        }

        // Check if current multiplier is even possible
        if (at > this.crashGameSocketController.gameStatus.crashPoint!)
            return socket.emit("bet-cashout-error", "The game has already ended!");

        // Check if user already cashed out
        if (bet.status !== this.crashGameSocketController.betStatus.Playing)
            return socket.emit("bet-cashout-error", "You have already cashed out!");

        // Send cashout request to handler
        this.crashGameSocketController.doCashOut(
            bet.playerID,
            at,
            false,
            (err, result) => {
                if (err) {
                    logger.info(
                        `Crash >> There was an error while trying to cashout a player`,
                        err
                    );
                    return socket.emit(
                        "bet-cashout-error",
                        "There was an error while cashing out!"
                    );
                }

                socket.emit("bet-cashout-success", result);
            }
        );
    };

    private joinGameHandler = async (data: TJoinGamePayload, socket: Socket) => {
        const { target, betAmount, denom } = data;
        if (!this.loggedIn) {
            return socket.emit("game-join-error", "You are not logged in!");
        }

        const userId = this.user!._id.toString();
        if (typeof betAmount !== "number" || isNaN(betAmount))
            return socket.emit("game-join-error", "Invalid betAmount type!");

        // Get crash enabled status
        const isEnabled = getCrashState();

        // If crash is disabled
        if (!isEnabled) {
            return socket.emit(
                "game-join-error",
                "Crash is currently disabled! Contact admins for more information."
            );
        }
        if (
            this.crashGameSocketController.gameStatus.status !== CGAME_STATES.Starting
        )
            return socket.emit("game-join-error", "Game is currently in progress!");
        // Check if user already betted
        if (
            this.crashGameSocketController.gameStatus.pending[userId] ||
            this.crashGameSocketController.gameStatus.players[userId]
        )
            return socket.emit(
                "game-join-error",
                "You have already joined this game!"
            );

        let autoCashOut = -1;

        // Validation on the target value, if acceptable assign to auto cashout
        if (typeof target === "number" && !isNaN(target) && target > 100) {
            autoCashOut = target;
        }

        this.crashGameSocketController.gameStatus.pending[userId] = {
            betAmount,
            denom,
            autoCashOut,
            username: this.user!.username,
        };

        this.crashGameSocketController.gameStatus.pendingCount++;

        try {
            // Get user from database
            const dbUser = await this.userService.getItem({ _id: userId });

            // If user is self-excluded
            if (dbUser!.selfExcludes.crash > Date.now()) {
                return socket.emit(
                    "game-join-error",
                    `You have self-excluded yourself for another ${((dbUser!.selfExcludes.crash - Date.now()) / 3600000).toFixed(1)} hours.`
                );
            }

            // If user has restricted bets
            if (dbUser!.betsLocked) {
                delete this.crashGameSocketController.gameStatus.pending[userId];
                this.crashGameSocketController.gameStatus.pendingCount--;
                return socket.emit(
                    "game-join-error",
                    "Your account has an betting restriction. Please contact support for more information."
                );
            }

            // If user can afford this bet
            if (
                (dbUser!.wallet?.get(denom) ?? 0) < parseFloat(betAmount.toFixed(2))
            ) {
                delete this.crashGameSocketController.gameStatus.pending[userId];
                this.crashGameSocketController.gameStatus.pendingCount--;
                return socket.emit("game-join-error", "You can't afford this bet!");
            }

            const newWalletValue =
                (dbUser!.wallet?.get(denom) || 0) -
                Math.abs(parseFloat(betAmount.toFixed(2)));
            const newWagerValue =
                (dbUser!.wager?.get(denom) || 0) +
                Math.abs(parseFloat(betAmount.toFixed(2)));
            const newWagerNeededForWithdrawValue =
                (dbUser!.wagerNeededForWithdraw?.get(denom) || 0) +
                Math.abs(parseFloat(betAmount.toFixed(2)));
            const newLeaderboardValue =
                (dbUser!.leaderboard?.get("crash")?.get(denom)?.betAmount || 0) +
                Math.abs(parseFloat(betAmount.toFixed(2)));

            // Remove bet amount from user's balance
            await this.userService.update(
                { _id: userId },
                {
                    $set: {
                        [`wallet.${denom}`]: newWalletValue,
                        [`wagar.${denom}`]: newWagerValue,
                        [`wagerNeededForWithdraw.${denom}`]: newWagerNeededForWithdrawValue,
                        [`leaderboard.crash.${denom}.betAmount`]: newLeaderboardValue,
                    },
                }
            );
            const newWalletTxData = {
                userId,
                amount: -Math.abs(parseFloat(betAmount.toFixed(2))),
                type: "Crash play",
                crashGameId: this.crashGameSocketController.gameStatus._id,
            };
            await this.walletTransactionService.create(newWalletTxData);

            // Update local wallet
            socket.emit("update-wallet", newWalletValue, denom);

            // Creating new bet object
            const newBet = {
                autoCashOut,
                betAmount,
                denom,
                createdAt: new Date(),
                playerID: userId,
                username: this.user!.username,
                avatar: this.user!.avatar,
                level: getVipLevelFromWager(
                    dbUser!.wager ? dbUser!.wager.get(denom) ?? 0 : 0
                ),
                status: this.crashGameSocketController.betStatus.Playing,
                forcedCashout: false,
            };

            // Updating in db
            const updateParam: IUpdateParams = { $set: {} };
            updateParam.$set["players." + userId] = newBet;
            await this.crashGameService.update(
                { _id: this.crashGameSocketController.gameStatus._id },
                updateParam
            );

            // Assign to state
            this.crashGameSocketController.gameStatus.players[userId] = newBet;
            this.crashGameSocketController.gameStatus.pendingCount--;

            const formattedBet =
                this.crashGameSocketController.formatPlayerBet(newBet);
            this.crashGameSocketController.gameStatus.pendingBets.push(formattedBet);
            this.crashGameSocketController.emitPlayerBets();

            return socket.emit("crashgame-join-success", formattedBet);
        } catch (error) {
            console.error(error);

            delete this.crashGameSocketController.gameStatus.pending[userId];
            this.crashGameSocketController.gameStatus.pendingCount--;

            return socket.emit(
                "game-join-error",
                "There was an error while proccessing your bet"
            );
        }
    };

    private disconnectHandler = async (socket: Socket) => {
        if (this.loggedIn && this.user?._id) {
            delete this.crashGameSocketController.gameStatus.connectedUsers[
                this.user._id.toString()
            ]; // Remove user from connected list
        }
    };

    private initGame = async () => {
        logger.info(this.logoPrefix + "Initializing game");
        const unfinishedGames =
            await this.crashGameSocketController.getUnfinishedGames();

        if (unfinishedGames.length > 0) {
            logger.info(
                this.logoPrefix + "Ending unfinished games-" + unfinishedGames.length
            );
            unfinishedGames.forEach(async (game) => {
                logger.info(this.logoPrefix + "Ending unfinished game id: " + game._id);
                await this.crashGameSocketController.refundGame(game._id as any);
            });
        }
    };

    private runGame = async () => {
        this.crashGameSocketController.runGame();
    };
}

export default CrashGameSocketListener;
