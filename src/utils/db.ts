import mongoose from "mongoose";

import { IS_PRODUCTION, MONGO_URL } from "@/config";

const optionConnect: object = {
  maxPoolSize: !IS_PRODUCTION ? 10 : 50,
};

mongoose.connect(MONGO_URL, optionConnect);

mongoose.Promise = global.Promise;

mongoose.connection.on("connected", function () {
  console.info("🚀 MongoDB Database connection established successfully");
});

mongoose.connection.on("error", function (err) {
  console.error("connection to mongo failed " + err);
});

mongoose.connection.on("disconnected", function () {
  console.info("mongo db connection closed");
  mongoose.connect(MONGO_URL, optionConnect);
});

export { default as Auth } from "@/modules/auth/auth.model";
export { default as AutoCrashBet } from "@/modules/auto-crash-bet/auto-crash-bet.model";
export { default as ChatHistory } from "@/modules/chat-history/chat-history.model";
export { default as CrashGame } from "@/modules/crash-game/crash-game.model";
export { default as Payment } from "@/modules/payment/payment.model";
export { default as RevenueLog } from "@/modules/revenue-log/reveune-log.model";
export { default as User } from "@/modules/user/user.model";
export { default as UserBot } from "@/modules/user-bot/user-bot.model";
export { default as WalletTransaction } from "@/modules/wallet-transaction/wallet-transaction.model";
