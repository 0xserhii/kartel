// Require Dependencies
import mongoose, { model, SchemaTypes } from "mongoose";

import { IAutoCrashBetModel } from "./auto-crash-bet.interface";

// Setup autobet CrashGame Schema
const AutoCrashBetSchema = new mongoose.Schema<IAutoCrashBetModel>(
  {
    // Basic fields
    user: {
      type: SchemaTypes.ObjectId,
      ref: "User",
    },

    // Game Betting Amount
    betAmount: {
      type: Number,
      default: 0,
    },

    denom: {
      type: String,
      default: "usk",
    },

    // Game auto cashout point
    cashoutPoint: {
      type: Number,
      default: 0,
    },

    // Game auto Betting status false = not started, true = started
    status: {
      type: Boolean,
      default: false,
    },

    // remaining Betting number
    count: {
      type: Number,
      default: 0,
    },

    // When game was created
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    minimize: false,
  }
);

export default model<IAutoCrashBetModel>(
  "AutoCrashBet",
  AutoCrashBetSchema,
  "autoCrashBet"
);
