import mongoose from "mongoose";
import { IUserDocumentModel } from "../user/user.interface";

export interface IAutoCrashBetModel extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId | IUserDocumentModel;
  betAmount: number;
  denom: string;
  cashoutPoint: number;
  status: boolean;
  count: number;
  createdAt: Date;
}