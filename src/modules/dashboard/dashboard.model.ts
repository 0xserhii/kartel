import { IDashboardModel } from '.';
// Require Dependencies
import mongoose, { model } from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

// Setup TransactionHis Schema
const DashboardSchema = new Schema<IDashboardModel>({
  // Revenue type 1: coinflip,2: crash, 3: mines
  revenueType: {
    type: Number,
    required: true,
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
  insertDate: {
    type: Date
  }
},
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<IDashboardModel>("Dashboard", DashboardSchema);
