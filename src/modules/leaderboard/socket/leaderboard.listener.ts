import { Namespace, Server, Socket, Event as SocketEvent } from "socket.io";
import { ESOCKET_NAMESPACE } from "@/constant/enum";
import { ELeaderboardEvents } from "../leaderboard.constant";

class LeaderboardSocketListener {
    private socketServer: Namespace;

    constructor(socketServer: Server) {
        this.socketServer = socketServer.of(ESOCKET_NAMESPACE.leaderboard);
        this.initializeListener();
        this.subscribeListener();
    }

    private subscribeListener(): void {
        this.socketServer.on("connection", (socket: Socket) => {
            this.initializeSubscribe(socket);
            // Check for users ban status
            socket.use(this.banStatusCheckMiddleware)

            // Disconnect leaderboard socket
            socket.on(ELeaderboardEvents.disconnect, async () => {
                this.disconnect(socket)
            });
        });
    }

    private initializeListener = async () => {

    }

    private initializeSubscribe = async (socket: Socket) => {

    }

    private banStatusCheckMiddleware = async (packet: SocketEvent, next: (err?: any) => void) => {

    }

    private disconnect = async (socket: Socket) => {

    }

}

export default LeaderboardSocketListener;
