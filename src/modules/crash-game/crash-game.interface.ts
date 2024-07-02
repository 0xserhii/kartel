import mongoose from "mongoose";

export interface ICrashGameDocument extends Document {
  _id: mongoose.Types.ObjectId;
  crashPoint?: number; // Optional as per schema
  players: Record<string, any>; // Required as per schema
  refundedPlayers?: any[]; // Optional as per schema
  privateSeed?: string; // Optional as per schema
  privateHash?: string; // Optional as per schema
  publicSeed?: string; // Optional as per schema, with default null
  status: number; // Required as per schema
  createdAt: Date; // Optional as per schema, with default Date.now
  startedAt?: Date; // Optional as per schema
}

export type TAutoCrashBetPayload = {
  betAmount: number;
  cashoutPoint: number;
  count: number;
  denom: string
}

export type TJoinGamePayload = { target: number; betAmount: number; denom: string }