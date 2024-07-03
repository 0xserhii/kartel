import mongoose, { model } from "mongoose";

import { IMinesGameModel } from "./mines-game.interface";

const SchemaTypes = mongoose.SchemaTypes;

// Setup MinesGame Schema
const MinesGameSchema = new mongoose.Schema<IMinesGameModel>({
  // Basic fields
  betAmount: Number, // User bet amount
  denom: {
    type: String,
    default: "usk",
  },
  betMinesCount: {
    // User bet number of mines
    type: Number,
    default: 2,
  },
  cashOut: {
    // User did cashout or not
    type: Boolean,
    default: false,
  },
  miningStep: {
    // current mining step
    type: Number,
    default: 0,
  },
  probabilities: {
    // probabilities of every mining step
    type: [Number],
    default: [],
  },

  // Provably Fair fields
  privateSeed: String,
  privateHash: String,
  publicSeed: {
    type: String,
    default: null,
  },
  mines: {
    type: [Number],
    default: [],
  },
  results: {
    type: [Number],
    default: [],
  },

  // UserID of who created this game
  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
  },

  // Game status
  status: {
    type: Number,
    default: 1,
    /**
     * Status list:
     *
     * 1 = Waiting
     * 2 = Rolling
     * 3 = Ended
     */
  },

  // When game was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<IMinesGameModel>("MinesGame", MinesGameSchema);
