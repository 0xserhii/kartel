// Require Dependencies
import mongoose, { model } from "mongoose";

import { IRevenueLogModel } from ".";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Setup TransactionHis Schema
const RevenueSchema = new Schema<IRevenueLogModel>({
  // Winner id
  userid: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  // Revenue type 1: coinflip,2: crash, 3: mines
  revenueType: {
    type: Number,
    required: true,
  },

  // Balance
  revenue: {
    type: Number,
    require: true,
  },

  gameId: {
    type: ObjectId,
    require: true,
  },

  // Denom
  denom: {
    type: String,
    require: true,
  },

  // Last balance
  lastBalance: {
    type: Number,
    require: true,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

export default model<IRevenueLogModel>("RevenueLog", RevenueSchema);
