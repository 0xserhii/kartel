import mongoose, { Document } from "mongoose";

export interface IRaceGameModel extends Document {
  active: boolean;
  prize: number;
  endingDate: Date;
  winners: mongoose.Types.ObjectId[];
  created: Date;
}
