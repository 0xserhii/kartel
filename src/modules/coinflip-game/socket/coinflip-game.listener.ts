import { Namespace, Server, Socket, Event as SocketEvent } from "socket.io";
import { ESOCKET_NAMESPACE } from "@/constant/enum";
import { ECoinflipGameEvents } from "../coinflip-game.constant";

class CoinflipGameSocketListener {
    private socketServer: Namespace;

    constructor(socketServer: Server) {
        this.socketServer = socketServer.of(ESOCKET_NAMESPACE.coinflip);
        this.initializeListener();
        this.subscribeListener();
    }

    private subscribeListener(): void {
        this.socketServer.on("connection", (socket: Socket) => {
            this.initializeSubscribe(socket);
            // Auth handler
            socket.on(ECoinflipGameEvents.auth, async (token: string) => {
                this.authHandler(token, socket)
            });
            // Create Coinflip Game handler
            socket.on(ECoinflipGameEvents.createCoinflipGame, async (data: {
                betAmount: number;
                denom: string;
                betCoinsCount: number;
                betSide: boolean;
                betSideCount: number;
            }) => {
                this.createCoinflipGame(data, socket)
            });
            // Disconnect Handler
            socket.on(ECoinflipGameEvents.disconnect, async () => {
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

    private createCoinflipGame = async (data: {
        betAmount: number;
        denom: string;
        betCoinsCount: number;
        betSide: boolean;
        betSideCount: number;
    }, socket: Socket) => {

    }

    private disconnect = async (socket: Socket) => {

    }

}

export default CoinflipGameSocketListener;
