import mongoose, { Document } from "mongoose";

export interface IWalletTransactionModel extends Document {
  amount: number;
  denom: string;
  reason: string;
  extraData: {
    coinflipGameId?: mongoose.Types.ObjectId;
    crashGameId?: mongoose.Types.ObjectId;
    transactionId?: mongoose.Types.ObjectId;
    couponId?: mongoose.Types.ObjectId;
    affiliatorId?: mongoose.Types.ObjectId;
    modifierId?: mongoose.Types.ObjectId;
    raceId?: mongoose.Types.ObjectId;
    triviaGameId?: mongoose.Types.ObjectId;
  };
  _user: mongoose.Types.ObjectId;
  created: Date;
}
