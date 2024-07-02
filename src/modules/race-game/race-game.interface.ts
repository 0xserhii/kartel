import mongoose from "mongoose";

export interface IRaceGame extends Document {
  active: boolean;
  prize: number;
  endingDate: Date;
  winners: mongoose.Types.ObjectId[];
  created: Date;
}