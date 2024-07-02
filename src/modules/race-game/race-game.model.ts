import { model, Schema, Types as SchemaTypes } from "mongoose";
import { IRaceGameModel } from "./race-game.interface";


// Setup Race Schema
const RaceSchema = new Schema<IRaceGameModel>({
  // Basic fields
  active: Boolean,
  prize: Number,
  endingDate: Date,

  // Race winners
  winners: {
    type: [
      {
        type: SchemaTypes.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },

  // When race was created
  created: {
    type: Date,
    default: Date.now,
  },
});

export default model<IRaceGameModel>("RaceGame", RaceSchema);
