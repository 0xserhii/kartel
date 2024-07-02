import mongoose from "mongoose";

export declare interface IRevenueLog {
  userid: mongoose.Types.ObjectId;
  revenueType: number;
  revenue: number;
  gameId: mongoose.Types.ObjectId;
  denom: string;
  lastBalance: number;
  created?: Date;
}