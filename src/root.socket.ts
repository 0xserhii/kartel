import { Server } from "socket.io";

import logger from "@/utils/logger";

import CoinflipGameSocketListener from "./modules/coinflip-game/socket/coinflip-game.listener";
import CrashGameSocketListener from "./modules/crash-game/socket/crash-game.listener";
import ChatHistorySocketListener from "./modules/chat-history/socket/chat-history.listener";
import LeaderboardSocketListener from "./modules/leaderboard/socket/leaderboard.listener";

class SocketServer {
    private socketServer: Server;

    constructor(socketServer: Server) {
        this.socketServer = socketServer;
        this.start();
    }

    private start() {
        try {
            new ChatHistorySocketListener(this.socketServer);
            new CrashGameSocketListener(this.socketServer);
            new LeaderboardSocketListener(this.socketServer);
            // new CoinflipGameSocketListener(this.socketServer);

            logger.info("Socket server started");
        } catch (error) {
            logger.error("Error starting socket server" + error);
        }
    }
}

export default SocketServer;
