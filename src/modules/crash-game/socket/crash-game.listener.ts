import { Namespace, Server, Socket, Event as SocketEvent } from "socket.io";
import { ObjectId } from "mongoose";
import { ECrashGameEvents } from "../crash-game.constant";
import { TAutoCrashBetPayload, TJoinGamePayload } from "../crash-game.interface";
import { ESOCKET_NAMESPACE } from "@/constant/enum";
import logger from "@/utils/logger";
import { CrashGameSocketController } from "./crash-game.socket-controller";

class CrashGameSocketListener {
    private rootSocketServer: Server;
    private socketServer: Namespace;
    private logoPrefix: string = "[Crash Game]::: ";
    private crashGameSocketController: CrashGameSocketController;

    constructor(socketServer: Server) {
        this.crashGameSocketController = new CrashGameSocketController();

        this.rootSocketServer = socketServer;
        this.socketServer = socketServer.of(ESOCKET_NAMESPACE.crash);
        this.initializeListener();
        this.subscribeListener();
    }

    private subscribeListener(): void {
        this.socketServer.on("connection", (socket: Socket) => {
            this.initializeSubscribe(socket);
            // Auth handler
            socket.on(ECrashGameEvents.auth, async (token: string) => {
                this.authHandler(token, socket)
            });
            // Get Previous history handler
            socket.on(ECrashGameEvents.getHistory, async (count: number) => {
                this.getHistoryHandler(count, socket)
            });
            // Auto Crash Bet Handler
            socket.on(ECrashGameEvents.autoCrashBet, async (data: TAutoCrashBetPayload) => {
                this.autoCrashBetHandler(data, socket)
            });
            // Cancel Auto Crash Bet Handler
            socket.on(ECrashGameEvents.cancelAutoBet, async () => {
                this.cancelAutoBetHandler(socket)
            });
            // Cashout the current bet Handler
            socket.on(ECrashGameEvents.joinGame, async (data: TJoinGamePayload) => {
                this.joinGameHandler(data, socket)
            });
            // Cashout the current bet Handler
            socket.on(ECrashGameEvents.betCashout, async () => {
                this.betCashoutHandler(socket)
            });
            // Disconnect Handler
            socket.on(ECrashGameEvents.disconnect, async () => {
                this.disconnectHandler(socket)
            });

            // Check for users ban status
            socket.use(this.banStatusCheckMiddleware)
        });
    }

    private initializeListener = async () => {
        try {
            await this.initGame()
        } catch (error) {
            logger.error(this.logoPrefix + "Error initializing game:", error)
        }
    }

    private initializeSubscribe = async (socket: Socket) => {

    }

    private banStatusCheckMiddleware = async (packet: SocketEvent, next: (err?: any) => void) => {

    }

    private authHandler = async (token: string, socket: Socket) => {

    }

    private getHistoryHandler = async (count: number, socket: Socket) => {

    }

    private autoCrashBetHandler = async (count: TAutoCrashBetPayload, socket: Socket) => {

    }

    private cancelAutoBetHandler = async (socket: Socket) => {

    }

    private betCashoutHandler = async (socket: Socket) => {

    }

    private joinGameHandler = async (data: TJoinGamePayload, socket: Socket) => {

    }

    private disconnectHandler = async (socket: Socket) => {

    }


    private initGame = async () => {
        logger.info(this.logoPrefix + "Initializing game")
        const unfinishedGames = await this.crashGameSocketController.getUnfinishedGames()

        if (unfinishedGames.length > 0) {
            logger.info(this.logoPrefix + "Ending unfinished games-" + unfinishedGames.length)
            unfinishedGames.forEach(async game => {
                logger.info(this.logoPrefix + "Ending unfinished game id: " + game._id)
                await this.crashGameSocketController.refundGame(game._id as any)
            })
        }
    }

    private runGame = async () => {
        
    }
}

export default CrashGameSocketListener;
