import { ObjectId, Types } from "mongoose";

export interface IChatHistoryDocument extends Document {
  _id: Types.ObjectId;
  message: string;
  user: ObjectId;
  sentAt: Date;
}
