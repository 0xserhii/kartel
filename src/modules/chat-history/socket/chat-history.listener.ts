import { Namespace, Server, Socket, Event as SocketEvent } from "socket.io";
import { ESOCKET_NAMESPACE } from "@/constant/enum";
import { EChatHistoryEvents } from "../chat-history.constant";

class ChatHistorySocketListener {
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
            socket.on(EChatHistoryEvents.auth, async (token: string) => {
                this.authHandler(token, socket)
            });
            socket.on(EChatHistoryEvents.getChatHistory, async (sentAt: Date) => {
                this.getChatHistory(sentAt, socket)
            });
            // Create Coinflip Game handler
            socket.on(EChatHistoryEvents.sendMessage, async (message: string) => {
                this.sendMessage(message, socket)
            });
            // Disconnect Handler
            socket.on(EChatHistoryEvents.disconnect, async () => {
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

    private sendMessage = async (message: string, socket: Socket) => {

    }

    private disconnect = async (socket: Socket) => {

    }

    private getChatHistory = async (sentAt: Date, socket: Socket) => {

    }
}

export default ChatHistorySocketListener;
