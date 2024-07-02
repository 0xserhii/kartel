import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import AuthRouter from "./modules/auth/auth.router";
import LogsRouter from "./modules/logs/logs.router";
import PaymentRouter from "./modules/payment/payment.router";
import UserRouter from "./modules/user/user.router";
import swaggerSetup from "./utils/swagger/swagger.setup";
import WalletTransactionRouter from "./modules/wallet-transaction/wallet-transaction.router";
import AutoCrashBetRouter from "./modules/auto-crash-bet/auto-crash-bet.router";
import ChatHistoryRouter from "./modules/chat-history/chat-history.router";
import CoinflipGameRouter from "./modules/coinflip-game/coinflip-game.router";
import CrashGameRouter from "./modules/crash-game/crash-game.router";
import MinesGameRouter from "./modules/mines-game/mines-game.router";
import RevenueLogRouter from "./modules/revenue-log/reveune-log.router";
import UserBotRouter from "./modules/user-bot/user-bot.router";

export default class RootRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.routes();
  }

  public routes(): void {
    this.router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup));

    this.router.use("/auth", new AuthRouter().router);
    this.router.use("/auto-crash-bet", new AutoCrashBetRouter().router);
    this.router.use("/logs", new LogsRouter().router);
    this.router.use("/chat-history", new ChatHistoryRouter().router);
    this.router.use("/coinflip-game", new CoinflipGameRouter().router);
    this.router.use("/crash-game", new CrashGameRouter().router);
    this.router.use("/mines-game", new MinesGameRouter().router);
    this.router.use("/wallet-transaction", new WalletTransactionRouter().router);
    this.router.use("/payment", new PaymentRouter().router);
    this.router.use("/revenue-log", new RevenueLogRouter().router);
    this.router.use("/user", new UserRouter().router);
    this.router.use("/user-bot", new UserBotRouter().router);

    this.router.get("/version", (_req, res) => res.json({ version: 1 }));
    this.router.get("/status", (_req, res) =>
      res.json({ status: "Welcome to YieldLab!" })
    );
  }
}
