import mongoose, { FilterQuery, ObjectId } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";
import _ from "lodash";
import { CrashGameService } from "../crash-game.service";
import { ICrashGameModel } from "../crash-game.interface";
import {
    CBET_STATES,
    CCrash_Config,
    CGAME_STATES,
    CTime,
} from "../crash-game.constant";
import logger from "@/utils/logger";
import UserService from "@/modules/user/user.service";
import { WalletTransactionService } from "@/modules/wallet-transaction";
import { Namespace } from "socket.io";
import {
    generateCrashRandom,
    generatePrivateSeedHashPair,
} from "@/utils/crypto/random";
import {
    IBetType,
    IGameStateType,
    TFormattedPlayerBetType,
} from "../crash-game.types";
import UserBotService from "@/modules/user-bot/user-bot.service";
import { CDENOM_TOKENS } from "@/constant/crypto";
import { getVipLevelFromWager } from "@/utils/customer/vip";
import { checkAndEnterRace } from "@/utils/customer/race";
import { AutoCrashBetService } from "@/modules/auto-crash-bet";
import { RevenueLogService } from "@/modules/revenue-log";

export class CrashGameSocketController {
    // Services
    private crashGameService: CrashGameService;
    private userService: UserService;
    private userBotServices: UserBotService;
    private autoCrashBetService: AutoCrashBetService;
    private reveneuLogService: RevenueLogService;
    private walletTransactionService: WalletTransactionService;

    // Diff services
    private localizations: ILocalization;

    public gameStatus: IGameStateType = {
        _id: null,
        status: CGAME_STATES.Starting,
        crashPoint: null,
        startedAt: null,
        duration: null,
        players: {},
        pending: {},
        pendingCount: 0,
        pendingBets: [],
        privateSeed: null,
        privateHash: null,
        publicSeed: null,
        connectedUsers: {},
    };

    public betStatus = {
        Playing: 1,
        CashedOut: 2,
    };

    // Logger config
    private logoPrefix: string = "CrashGameSocketController::: ";

    // Socket setting
    private crashSocketNamespace: Namespace;

    constructor() {
        this.reveneuLogService = new RevenueLogService();
        this.crashGameService = new CrashGameService();
        this.userService = new UserService();
        this.userBotServices = new UserBotService();
        this.autoCrashBetService = new AutoCrashBetService();
        this.walletTransactionService = new WalletTransactionService();

        this.localizations = localizations["en"];
    }

    public setSocketNamespace = (namespace: Namespace) => {
        this.crashSocketNamespace = namespace;
    };

    public getAll = async () => {
        const crashGameFilter = <FilterQuery<ICrashGameModel>>{};
        const [item, count] = await Promise.all([
            this.crashGameService.get(crashGameFilter),
            this.crashGameService.getCount(crashGameFilter),
        ]);

        return {
            item,
            count,
        };
    };

    public getByName = async (name) => {
        const crashGame = await this.crashGameService.getItem({ name });

        // need add to localizations
        if (!crashGame) {
            throw new CustomError(404, "Crash game not found");
        }

        return crashGame;
    };

    public getById = async (crashGameId) => {
        const crashGame = await this.crashGameService.getItemById(crashGameId);

        // need add to localizations
        if (!crashGame) {
            throw new CustomError(404, "Crash game not found");
        }

        return crashGame;
    };

    public create = async (crashGame) => {
        try {
            return await this.crashGameService.create(crashGame);
        } catch (error) {
            if (error.code === 11000) {
                throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
            }

            throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
        }
    };

    public update = async ({ id }, crashGameData) => {
        try {
            const crashGame = await this.crashGameService.updateById(
                id,
                crashGameData
            );

            // need add to localizations
            if (!crashGame) {
                throw new CustomError(404, "Crash game not found");
            }

            return crashGame;
        } catch (error) {
            if (error.code === 11000) {
                throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
            } else if (error.status) {
                throw new CustomError(error.status, error.message);
            } else {
                throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
            }
        }
    };

    public delete = async ({ id }) => {
        const crashGame = await this.crashGameService.deleteById(id);

        // need add to localizations
        if (!crashGame) {
            throw new CustomError(404, "Crash game not found");
        }

        return crashGame;
    };

    public getUnfinishedGames = async () => {
        return this.crashGameService.getUnfinishedGames();
    };

    public refundGame = async (gameId: ObjectId) => {
        const game = await this.crashGameService.getItemById(gameId);
        if (!game) {
            return null;
        }
        const refundedPlayers = [];

        for (const playerID in game.players) {
            const bet = game.players[playerID];

            if (bet.status == CBET_STATES.Playing) {
                // Push Player ID to the refunded players
                refundedPlayers.push(playerID);

                logger.info(
                    this.logoPrefix + `Refunding player ${playerID} for ${bet.betAmount}`
                );

                // Refund player
                await this.userService.updateById(playerID, {
                    $inc: {
                        [`wallet.${bet.denom}`]: Math.abs(bet.betAmount),
                    },
                });
                const newWalletTxData = {
                    _user: new mongoose.Types.ObjectId(playerID),
                    amount: Math.abs(bet.betAmount),
                    reason: "Crash refund",
                    extraData: { crashGameId: game._id },
                };
                await this.walletTransactionService.create(newWalletTxData);
            }
        }

        // Update game status
        const updatePayload = {
            refundedPlayers,
            status: CGAME_STATES.Refunded,
        };
        const updatedGame = await this.crashGameService.updateById(
            gameId,
            updatePayload
        );

        return updatedGame;
    };

    public getRandomBetAmount = () => {
        const randomNumber = Math.random();
        let betAmount;

        if (randomNumber <= 0.95) {
            // 95% chance for bets between 0.1 and 8
            if (Math.random() <= 0.65) {
                // 65% chance for bets without decimals (full numbers)
                betAmount = Math.floor(Math.random() * 8) + 1; // Generates a random integer between 1 and 8 (inclusive)
            } else {
                // 35% chance for bets with decimals
                betAmount = Math.random() * (8 - 0.1) + 0.1; // Generates a random decimal number between 0.1 and 8
            }
        } else {
            // 5% chance for bets between 8 and 120.2
            if (Math.random() <= 0.65) {
                // 65% chance for bets without decimals (full numbers)
                betAmount = Math.floor(Math.random() * (120.2 - 8)) + 8; // Generates a random integer number between 8 and 120.2
            } else {
                // 35% chance for bets with decimals
                betAmount = Math.random() * (120.2 - 8) + 8; // Generates a random decimal number between 8 and 120.2
            }
        }

        return parseFloat(betAmount.toFixed(2));
    };

    public generateRandomNumber = () => {
        const min = 105;
        const max = 2000;

        // Generate a random number between 0 and 1
        const random = Math.random();

        let randomNumber: number;

        if (random < 0.3) {
            // 30% chance of a number below 150
            randomNumber = min + Math.random() * (150 - min);
        } else if (random < 0.5) {
            // 20% chance of a number below 200
            randomNumber = min + Math.random() * (200 - min);
        } else if (random < 0.7) {
            // 20% chance of a number below 300
            randomNumber = min + Math.random() * (300 - min);
        } else {
            // Remaining 30% can be any value below 2000
            randomNumber = min + Math.random() * (max - min);
        }

        return randomNumber;
    };

    private createNewGameBySeed = async () => {
        try {
            // Generate pre-roll provably fair data
            const privatePairs = await generatePrivateSeedHashPair();
            const newGamePayload = {
                privateSeed: privatePairs.seed,
                privateHash: privatePairs.hash,
                players: {},
                status: CGAME_STATES.Starting,
            };
            const newGame = await this.crashGameService.create(newGamePayload);
            logger.info(this.logoPrefix + "New game created: ", newGame._id);
            return newGame;
        } catch (error) {
            logger.error(this.logoPrefix + "Error creating new game: ", error);
        }
    };

    public runGame = async () => {
        try {
            const game = await this.createNewGameBySeed();
            // Override local state
            this.gameStatus._id = game._id;
            this.gameStatus.status = CGAME_STATES.Starting;
            this.gameStatus.privateSeed = game.privateSeed!;
            this.gameStatus.privateHash = game.privateHash!;
            this.gameStatus.publicSeed = null;
            this.gameStatus.startedAt = new Date(
                Date.now() + CTime.restart_wait_time
            );
            this.gameStatus.players = {};

            // Update startedAt in db
            this.crashGameService.updateById(game._id.toString(), {
                startedAt: this.gameStatus.startedAt,
            });

            try {
                // Bet for autobet players
                const autoBetPlayers =
                    await this.autoCrashBetService.aggregateByPipeline([
                        { $match: { status: true } },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                as: "user",
                            },
                        },
                    ]);

                for (const autoBetPlayer of autoBetPlayers) {
                    const { user, betAmount, denom, cashoutPoint, count } = autoBetPlayer;
                    if (user?._id) {
                        this.gameStatus.pending[String(user._id)] = {
                            betAmount,
                            denom,
                            autoCashOut: cashoutPoint,
                            username: user.username,
                        };
                        this.gameStatus.pendingCount++;
                        logger.info(
                            this.logoPrefix + `autobet :::`,
                            autoBetPlayer.user._id
                        );

                        // If user is self-excluded
                        if (user!.selfExcludes.crash > Date.now()) {
                            await this.autoCrashBetService.deleteById(autoBetPlayer._id);
                            delete this.gameStatus.pending[user.id];
                            this.gameStatus.pendingCount--;
                            return this.crashSocketNamespace
                                .to(String(user._id))
                                .emit(
                                    "game-join-error",
                                    `You have self-excluded yourself for another ${((user!.selfExcludes.crash - Date.now()) / 3600000).toFixed(1)} hours. Autobet has canceled`
                                );
                        }

                        // If user has restricted bets
                        if (user!.betsLocked) {
                            await this.autoCrashBetService.deleteById(autoBetPlayer._id);
                            delete this.gameStatus.pending[user.id];
                            this.gameStatus.pendingCount--;
                            return this.crashSocketNamespace
                                .to(String(user._id))
                                .emit(
                                    "game-join-error",
                                    "Your account has an betting restriction. Please contact support for more information. Autobet has canceled"
                                );
                        }

                        // If user can afford this bet
                        if (
                            (user!.wallet?.get(denom) ?? 0) < parseFloat(betAmount.toFixed(2))
                        ) {
                            await this.autoCrashBetService.deleteById(autoBetPlayer._id);
                            delete this.gameStatus.pending[user.id];
                            this.gameStatus.pendingCount--;
                            return this.crashSocketNamespace
                                .to(String(user._id))
                                .emit(
                                    "game-join-error",
                                    "You can't afford this autobet! Autobet has canceled"
                                );
                        }

                        if (count <= 0) {
                            await this.autoCrashBetService.deleteById(autoBetPlayer._id);
                            delete this.gameStatus.pending[user.id];
                            this.gameStatus.pendingCount--;
                            return this.crashSocketNamespace
                                .to(String(user._id))
                                .emit(
                                    "game-join-error",
                                    "Autobet has reached the max number of bets! Autobet has canceled"
                                );
                        }

                        // decrease the autobet count by one
                        await this.autoCrashBetService.updateById(autoBetPlayer._id, {
                            $set: { count: count - 1 },
                        });

                        const newWalletValue =
                            (user!.wallet?.get(denom) || 0) -
                            Math.abs(parseFloat(betAmount.toFixed(2)));
                        const newWagerValue =
                            (user!.wager?.get(denom) || 0) +
                            Math.abs(parseFloat(betAmount.toFixed(2)));
                        const newWagerNeededForWithdrawValue =
                            (user!.wagerNeededForWithdraw?.get(denom) || 0) +
                            Math.abs(parseFloat(betAmount.toFixed(2)));
                        const newLeaderboardValue =
                            (user!.leaderboard?.get("crash")?.get(denom)?.betAmount || 0) +
                            Math.abs(parseFloat(betAmount.toFixed(2)));

                        // Remove bet amount from user's balance
                        await this.userService.updateById(user.id, {
                            $set: {
                                [`wallet.${denom}`]: newWalletValue,
                                [`wagar.${denom}`]: newWagerValue,
                                [`wagerNeededForWithdraw.${denom}`]:
                                    newWagerNeededForWithdrawValue,
                                [`leaderboard.crash.${denom}.betAmount`]: newLeaderboardValue,
                            },
                        });
                        const newWalletTxData = {
                            _user: new mongoose.Types.ObjectId(user.id),
                            amount: Math.abs(betAmount.toFixed(2)),
                            reason: "Crash play",
                            extraData: { crashGameId: this.gameStatus._id },
                        };
                        await this.walletTransactionService.create(newWalletTxData);

                        // Update local wallet
                        this.crashSocketNamespace
                            .to(String(user._id))
                            .emit("update-wallet", newWalletValue, denom);

                        // Update user's race progress if there is an active race
                        await checkAndEnterRace(
                            user.id,
                            Math.abs(parseFloat(betAmount.toFixed(2)))
                        );

                        // Calculate house edge
                        const houseRake =
                            parseFloat(betAmount.toFixed(2)) * CCrash_Config.houseEdge;

                        // Apply 5% rake to current race prize pool
                        // await checkAndApplyRakeToRace(houseRake * 0.05);

                        // Apply user's rakeback if eligible
                        // await checkAndApplyRakeback(user.id, houseRake);

                        // Apply cut of house edge to user's affiliator
                        // await checkAndApplyAffiliatorCut(user.id, houseRake);

                        // Creating new bet object
                        // Creating new bet object
                        const newBet: IBetType = {
                            autoCashOut: cashoutPoint,
                            betAmount,
                            denom,
                            createdAt: new Date(),
                            playerID: String(user._id),
                            username: user.username,
                            avatar: user.avatar,
                            level: getVipLevelFromWager(
                                user!.wager ? user!.wager.get(denom) ?? 0 : 0
                            ),
                            status: CBET_STATES.Playing,
                            forcedCashout: true,
                        };

                        // Updating in db
                        const updateParam = { $set: {} };
                        updateParam.$set["players." + user.id] = newBet;
                        await this.crashGameService.updateById(
                            this.gameStatus._id as any,
                            updateParam
                        );

                        // Assign to state
                        this.gameStatus.players[user.id] = newBet;
                        this.gameStatus.pendingCount--;

                        const formattedBet = this.formatPlayerBet(newBet);
                        this.gameStatus.pendingBets.push(formattedBet);
                        this.emitPlayerBets();

                        return this.crashSocketNamespace
                            .to(String(user._id))
                            .emit("auto-crashgame-join-success", "Autobet is running.");
                    }
                }
            } catch (error) {
                logger.error(
                    this.logoPrefix + "Error while starting a crash game with auto bets:",
                    error
                );
            }

            try {
                // Bet a random number of bot players
                const allBots = await this.userBotServices.get();
                const randomNumberOfPlayers = Math.floor(Math.random() * 4) + 8;
                const selectedBotPlayers = allBots
                    .sort(() => 0.5 - Math.random())
                    .slice(0, randomNumberOfPlayers);

                for (const botPlayer of selectedBotPlayers) {
                    const { _id, username, avatar, wager } = botPlayer;
                    const betAmount = this.getRandomBetAmount();

                    const denoms = Object.keys(CDENOM_TOKENS);
                    const denomIndex = Math.floor(Math.random() * denoms.length);
                    const denom = denoms[denomIndex];

                    const delay = Math.floor(Math.random() * 7 + 2) * 1000; // Generate a random delay between 2-8 seconds

                    setTimeout(async () => {
                        const CASHOUTNUMBER = this.generateRandomNumber();
                        this.gameStatus.pending[String(_id)] = {
                            betAmount,
                            denom,
                            autoCashOut: CASHOUTNUMBER,
                            username: username,
                        };

                        this.gameStatus.pendingCount++;

                        // Creating new bet object
                        const newBet: IBetType = {
                            autoCashOut: CASHOUTNUMBER,
                            betAmount,
                            denom,
                            createdAt: new Date(),
                            playerID: String(_id),
                            username: username,
                            avatar: avatar,
                            level: getVipLevelFromWager(wager),
                            status: CBET_STATES.Playing,
                            forcedCashout: true,
                        };

                        // Remove bet amount from user's balance
                        await this.userBotServices.updateById(_id as string, {
                            $inc: {
                                wager: Math.abs(parseFloat(betAmount.toFixed(2))),
                            },
                        });

                        await checkAndEnterRace(
                            String(_id),
                            Math.abs(parseFloat(betAmount.toFixed(2)))
                        );

                        // Updating in db
                        const updateParam = { $set: {} };
                        updateParam.$set["players." + _id] = newBet;
                        await this.crashGameService.updateById(
                            this.gameStatus._id.toString(),
                            updateParam
                        );

                        // Assign to state
                        this.gameStatus.players[String(_id)] = newBet;
                        this.gameStatus.pendingCount--;

                        const formattedBet = this.formatPlayerBet(newBet);
                        this.gameStatus.pendingBets.push(formattedBet);
                        return this.emitPlayerBets();
                    }, delay);
                }
            } catch (error) {
                logger.error(this.logoPrefix + "Error Crash", error);
                this.gameStatus.pendingCount--;
            }

            this.emitStarting();
        } catch (error) {
            logger.error(this.logoPrefix + "Error running game: ", error);
        }
    };

    public emitPlayerBets = () => {
        const _emitPendingBets = () => {
            const bets = this.gameStatus.pendingBets;
            this.gameStatus.pendingBets = [];

            this.crashSocketNamespace.emit("game-bets", bets);
        };
        return _.throttle(_emitPendingBets, 600);
    };

    public formatPlayerBet = (bet: IBetType): TFormattedPlayerBetType => {
        const formatted: TFormattedPlayerBetType = {
            playerID: bet.playerID,
            username: bet.username,
            avatar: bet.avatar,
            betAmount: bet.betAmount,
            denom: bet.denom,
            status: bet.status,
            level: bet.level,
        };

        if (bet.status !== CBET_STATES.Playing) {
            formatted.stoppedAt = bet.stoppedAt;
            formatted.winningAmount = bet.winningAmount;
        }
        return formatted;
    };

    // Emits the start of the game and handles blocking
    public emitStarting = () => {
        // Emiting starting to clients
        this.crashSocketNamespace.emit("game-starting", {
            _id: this.gameStatus._id!.toString(),
            privateHash: this.gameStatus.privateHash,
            timeUntilStart: CTime.restart_wait_time,
        });

        setTimeout(this.blockGame, CTime.restart_wait_time - 500);
    };

    public blockGame = () => {
        this.gameStatus.status = CGAME_STATES.Blocking;

        const loop = (): NodeJS.Timeout => {
            const ids: string[] = Object.keys(this.gameStatus.pending);
            if (this.gameStatus.pendingCount > 0) {
                logger.info(
                    this.logoPrefix +
                    `Crash >> Delaying game while waiting for ${ids.length} (${ids.join(", ")}) join(s)`
                );
                return setTimeout(loop, 50);
            }

            this.startGame();
            return null as any; // To ensure return type consistency, though `startGame` should ideally be typed as `void`
        };

        loop();
    };

    public startGame = async () => {
        try {
            // Generate random data
            const randomData = await generateCrashRandom(
                this.gameStatus.privateSeed!
            );

            // Overriding game state
            this.gameStatus.status = CGAME_STATES.InProgress;
            this.gameStatus.crashPoint = randomData.crashPoint;
            this.gameStatus.publicSeed = randomData.publicSeed;
            this.gameStatus.duration = Math.ceil(
                16666.666667 * Math.log(0.01 * (this.gameStatus.crashPoint + 1))
            );
            this.gameStatus.startedAt = new Date();
            this.gameStatus.pending = {};
            this.gameStatus.pendingCount = 0;

            logger.info(
                this.logoPrefix +
                `Starting new game ${this.gameStatus._id} with crash point ${this.gameStatus.crashPoint / 100}`
            );

            // Updating in db
            await this.crashGameService.updateById(this.gameStatus._id as any, {
                status: CGAME_STATES.InProgress,
                crashPoint: this.gameStatus.crashPoint,
                publicSeed: this.gameStatus.publicSeed,
                startedAt: this.gameStatus.startedAt,
            });

            // Emiting start to clients
            this.crashSocketNamespace.emit("game-start", {
                publicSeed: this.gameStatus.publicSeed,
            });

            this.callTick(0);
        } catch (error) {
            logger.error(
                this.logoPrefix + `Error while starting a crash game: ${error}`
            );

            // Notify clients that we had an error
            this.crashSocketNamespace.emit(
                "notify-error",
                "Our server couldn't connect to EOS Blockchain, retrying in 15s"
            );

            // Timeout to retry
            const timeout: NodeJS.Timeout = setTimeout(() => {
                // Retry starting the game
                this.startGame();

                clearTimeout(timeout);
            }, 15000);
        }
    };

    public callTick = (elapsed: number) => {
        // Calculate next tick
        const left = this.gameStatus.duration! - elapsed;
        const nextTick = Math.max(0, Math.min(left, CTime.tick_rate));

        setTimeout(this.runTick, nextTick);
    };

    public runTick = () => {
        // Calculate elapsed time
        const elapsed = Date.now() - this.gameStatus.startedAt!.getTime();
        const at = Math.floor(100 * Math.pow(Math.E, 0.00006 * elapsed));

        // Completing all auto cashouts
        this.runCashOuts(at);

        // Check if crash point is reached
        if (at > this.gameStatus.crashPoint!) {
            this.endGame();
        } else {
            const gamePayout =
                Math.floor(
                    100 * Math.floor(100 * Math.pow(Math.E, 0.00006 * elapsed))
                ) / 100;
            const gamePayoutValue = Math.max(gamePayout, 1);
            this.crashSocketNamespace.emit("game-tick", gamePayoutValue / 100);
            this.callTick(elapsed);
        }
    };

    public runCashOuts = (elapsed: number) => {
        _.each(this.gameStatus.players, (bet) => {
            // Check if bet is still active
            if (bet.status !== CBET_STATES.Playing) return;
            // Check if the auto cashout is reached or max profit is reached
            if (
                bet.autoCashOut >= 101 &&
                bet.autoCashOut <= elapsed &&
                bet.autoCashOut <= this.gameStatus.crashPoint!
            ) {
                this.doCashOut(
                    bet.playerID,
                    bet.autoCashOut,
                    false,
                    (err: Error | null) => {
                        if (err) {
                            logger.error(
                                this.logoPrefix +
                                `There was an error while trying to cashout ${err}`
                            );
                        }
                    }
                );
            } else if (
                bet.betAmount * (elapsed / 100) >= CCrash_Config.maxProfit &&
                elapsed <= this.gameStatus.crashPoint!
            ) {
                console.log("MAX_LIMMIT_AUTOCASHOUT");
                this.doCashOut(bet.playerID, elapsed, true, (err: Error | null) => {
                    if (err) {
                        logger.error(
                            this.logoPrefix +
                            `There was an error while trying to cashout ${err}`
                        );
                    }
                });
            }
        });
    };

    public endGame = async () => {
        logger.info(
            this.logoPrefix + `Ending game at ${this.gameStatus.crashPoint! / 100}`
        );

        const crashTime = Date.now();

        this.gameStatus.status = CGAME_STATES.Over;

        // Notify clients
        this.crashSocketNamespace.emit("game-end", {
            game: {
                _id: this.gameStatus._id,
                createdAt: this.gameStatus.createdAt,
                privateHash: this.gameStatus.privateHash ?? null,
                privateSeed: this.gameStatus.privateSeed ?? null,
                publicSeed: this.gameStatus.publicSeed ?? null,
                crashPoint: this.gameStatus.crashPoint! / 100,
            },
        });

        // Run new game after start wait time
        setTimeout(
            () => {
                this.runGame();
            },
            crashTime + CTime.start_wait_time - Date.now()
        );

        // Updating in db
        await this.crashGameService.updateById(this.gameStatus._id as any, {
            status: CGAME_STATES.Over,
        });
    };

    public doCashOut = async (
        playerID: string,
        elapsed: number,
        forced: boolean,
        cb: (err: Error | null, result?: any) => void
    ) => {
        logger.info(this.logoPrefix + `Doing cashout for ${playerID}`);
        // Check if bet is still active
        if (this.gameStatus.players[playerID].status !== CBET_STATES.Playing)
            return;

        // Update player state
        this.gameStatus.players[playerID].status = CBET_STATES.CashedOut;
        this.gameStatus.players[playerID].stoppedAt = elapsed;
        if (forced) this.gameStatus.players[playerID].forcedCashout = true;

        const bet = this.gameStatus.players[playerID];

        // Calculate winning amount
        let winningAmount = 0;
        if (bet.autoCashOut !== undefined && bet.stoppedAt !== undefined) {
            winningAmount = parseFloat(
                (
                    bet.betAmount *
                    ((bet.autoCashOut === bet.stoppedAt
                        ? bet.autoCashOut
                        : bet.stoppedAt) /
                        100)
                ).toFixed(2)
            );
        } else {
            console.error("Error: autoCashOut or stoppedAt is undefined.");
        }

        const houseAmount = winningAmount * CCrash_Config.houseEdge;
        winningAmount *= 1 - CCrash_Config.houseEdge;

        this.gameStatus.players[playerID].winningAmount = winningAmount;

        if (cb) cb(null, this.gameStatus.players[playerID]);

        const { status, stoppedAt } = this.gameStatus.players[playerID];
        const userdata = this.gameStatus.players[playerID];

        // Emiting cashout to clients
        this.crashSocketNamespace.emit("bet-cashout", {
            userdata,
            status,
            stoppedAt,
            winningAmount,
        });

        // Giving winning balance to user
        const user = await this.userService.getItemById(playerID);

        if (user) {
            // Get the current value from the wallet map
            const currentValue = user.wallet.get(bet.denom) || 0;

            // Increment the value
            const newValue = currentValue + Math.abs(winningAmount);
            const newLeaderboardValue =
                (user.leaderboard?.get("crash")?.get(bet.denom)?.winAmount || 0) +
                Math.abs(winningAmount);

            console.log("winningAmount :", bet.stoppedAt, elapsed, winningAmount);
            await this.userService.updateById(playerID, {
                $set: {
                    [`wallet.${bet.denom}`]: newValue,
                    [`leaderboard.crash.${bet.denom}.winAmount`]: newLeaderboardValue,
                },
            });

            // Update local wallet
            this.crashSocketNamespace
                .to(playerID)
                .emit("update-wallet", newValue, bet.denom);

            // Add revenue to the site wallet
            const revenueId = process.env.REVENUE_ID;
            const siteUser = await this.userService.getItemById(revenueId);
            if (siteUser) {
                let newSiteWalletValue = 0;
                if (siteUser?.wallet)
                    newSiteWalletValue =
                        siteUser?.wallet.get(bet.denom) || 0 + houseAmount;
                else newSiteWalletValue = houseAmount;
                await this.userService.updateById(revenueId, {
                    $set: {
                        [`wallet.${bet.denom}`]: newSiteWalletValue,
                    },
                });
            } else {
                logger.error(this.logoPrefix + "Couldn't find site user!");
            }
            const siteuser = await this.userService.getItemById(revenueId);
            // revenue log
            if (siteUser) {
                const newRevenuePayload = {
                    userid: new mongoose.Types.ObjectId(playerID),
                    // Revenue type 1: coinflip, 2: crash
                    revenueType: 2,
                    // Balance
                    revenue: houseAmount,
                    denom: bet.denom,
                    lastBalance: siteuser!.wallet.get(bet.denom),
                };
                await this.reveneuLogService.create(newRevenuePayload);
            }
        }

        const newWalletTxData = {
            _user: new mongoose.Types.ObjectId(playerID),
            amount: Math.abs(winningAmount),
            reason: "Crash Win",
            extraData: { crashGameId: this.gameStatus._id },
        };
        await this.walletTransactionService.create(newWalletTxData);

        // Updating in db
        const updateParam = { $set: {} };
        updateParam.$set["players." + playerID] = this.gameStatus.players[playerID];
        await this.crashGameService.updateById(
            this.gameStatus._id as any,
            updateParam
        );
    };

    public growthFunc = (ms: number) =>
        Math.floor(100 * Math.pow(Math.E, 0.00006 * ms));
}
