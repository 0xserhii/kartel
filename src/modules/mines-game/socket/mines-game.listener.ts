import { Namespace, Server, Socket, Event as SocketEvent } from "socket.io";
import { ESOCKET_NAMESPACE } from "@/constant/enum";
import { EMinesGameEvents } from "../mines-game.constant";

class MinesGameSocketListener {
    private socketServer: Namespace;

    constructor(socketServer: Server) {
        this.socketServer = socketServer.of(ESOCKET_NAMESPACE.mines);
        this.initializeListener();
        this.subscribeListener();
    }

    private subscribeListener(): void {
        this.socketServer.on("connection", (socket: Socket) => {
            this.initializeSubscribe(socket);
            // Auth handler
            socket.on(EMinesGameEvents.auth, async (token: string) => {
                this.authHandler(token, socket)
            });
            // Create Coinflip Game handler
            socket.on(EMinesGameEvents.createMinesGame, async (data: {
                betAmount: number;
                denom: string;
                betMinesCount: number
            }) => {
                this.createMinesGame(data, socket)
            });

            socket.on(EMinesGameEvents.minesRolling, async (position: number) => {
                this.minesRolling(position, socket)
            });

            socket.on(EMinesGameEvents.minesCashout, async () => {
                this.minesCashout(socket)
            });

            // Disconnect Handler
            socket.on(EMinesGameEvents.disconnect, async () => {
                this.disconnect(socket)
            });

            // Check for users ban status
            socket.use(this.banStatusCheckMiddleware)
        });
    }

    private initializeListener = async () => {

    }

    private initializeSubscribe = async (socket: Socket) => {

    }

    private banStatusCheckMiddleware = async (packet: SocketEvent, next: (err?: any) => void) => {

    }

    private authHandler = async (token: string, socket: Socket) => {

    }

    private createMinesGame = async (data: {
        betAmount: number;
        denom: string;
        betMinesCount: number;
    }, socket: Socket) => {

    }

    private minesRolling = async (position: number, socket: Socket) => {

    }

    private minesCashout = async (socket: Socket) => {

    }

    private disconnect = async (socket: Socket) => {

    }

}

export default MinesGameSocketListener;
