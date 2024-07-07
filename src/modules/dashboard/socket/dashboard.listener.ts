import { Namespace, Server, Socket } from "socket.io";

import { ESOCKET_NAMESPACE } from "@/constant/enum";
import logger from "@/utils/logger";

import { DashboardService } from "../dashboard.service";
import { RevenueLogService } from "@/modules/revenue-log";
import { LeaderboardService } from "@/modules/leaderboard";

class DashboardSocketListener {
  private socketServer: Namespace;
  private dashboardService: DashboardService;
  private revenueLog: RevenueLogService;
  private leaderboard: LeaderboardService;
  private logPrefix = "[Dashboard Socket:::]";

  constructor(socketServer: Server) {
    // Initialize service
    this.dashboardService = new DashboardService();
    this.revenueLog = new RevenueLogService();
    this.leaderboard = new LeaderboardService();
    this.socketServer = socketServer.of(ESOCKET_NAMESPACE.dashboard);
    this.initializeListener();
    this.subscribeListener();
  }

  private subscribeListener(): void {
    this.socketServer.on("connection", (_socket: Socket) => {
      // this.initializeSubscribe(socket);
    });
  }

  private initializeListener = async () => {
    try {
      const emitDashboard = async () => {
        const start = Date.now();
        const dashboardResponse =
          await this.revenueLog.fetchDashboardData();

        if (
          dashboardResponse &&
          Object.keys(dashboardResponse).length > 0
        ) {
          this.socketServer.emit("dashboard-fetch-all", {
            message: "success",
            dashboard: dashboardResponse!,
          });
        } else {
          this.socketServer.emit(
            "notify-error",
            "Error ocurred when fetched dashboard!"
          );
        }

        const elapsed = Date.now() - start;
        setTimeout(emitDashboard, Math.max(0, 2000 - elapsed));
      };

      const emitTopPlayers = async () => {
        const start = Date.now();
        const dashboardPnlResponse = await this.leaderboard.fetchTopPlayers(5);
        console.log(dashboardPnlResponse);

        if (dashboardPnlResponse && Object.keys(dashboardPnlResponse).length > 0) {
          this.socketServer.emit("dashboard-top-players", {
            message: "success",
            topPlayers: dashboardPnlResponse!,
          });
        }

        const elapsed = Date.now() - start;
        setTimeout(emitTopPlayers, Math.max(0, 2000 - elapsed));
      }

      emitDashboard();
      emitTopPlayers();
    } catch (error) {
      logger.error(this.logPrefix + "Emit dashboard error: " + error);
    }
  };

  // private initializeSubscribe = async (socket: Socket) => { };
  // private disconnect = async (socket: Socket) => {};
}

export default DashboardSocketListener;
