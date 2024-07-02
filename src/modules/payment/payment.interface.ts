import Joi from "joi";
import { ObjectId } from "mongoose";

export interface IPaymentDocumentType extends Document {
  _id: ObjectId;
  userId?: string;
  walletAddress?: string;
  type: string;
  amount: number;
  txHash: string;
  createdAt: Date;
}
