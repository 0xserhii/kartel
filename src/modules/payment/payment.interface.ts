import { Document } from "mongoose";

export interface IPaymentModel extends Document {
  userId?: string;
  walletAddress?: string;
  type: string;
  amount: number;
  txHash: string;
  createdAt: Date;
}
