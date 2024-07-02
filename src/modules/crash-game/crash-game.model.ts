// Require Dependencies
import mongoose, { Document, Model, model } from 'mongoose';
import { ICrashGameDocument } from './crash-game.interface';

// Setup CrashGame Schema
const CrashGameSchema = new mongoose.Schema(
  {
    // Basic fields
    crashPoint: Number,
    players: Object,
    refundedPlayers: Array,

    // Provably Fair fields
    privateSeed: String,
    privateHash: String,
    publicSeed: {
      type: String,
      default: null,
    },

    // Game status
    status: {
      type: Number,
      default: 1,
      /**
       * Status list:
       *
       * 1 = Not Started
       * 2 = Starting
       * 3 = In Progress
       * 4 = Over
       * 5 = Blocking
       * 6 = Refunded
       */
    },

    // When game was created
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // When game was started
    startedAt: {
      type: Date,
    },
  },
  {
    minimize: false,
  }
);

export default model<ICrashGameDocument>("CrashGame", CrashGameSchema)
