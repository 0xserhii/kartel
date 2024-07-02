import { ObjectId, Types } from "mongoose";

export interface ICoinflipGameDocument extends Document {
  _id: Types.ObjectId;
  betAmount: number;
  denom: string;
  betCoinsCount: number;
  betSide: boolean;
  betSideCount: number;
  privateSeed?: string;
  privateHash: string;
  publicSeed: string | null;
  randomModule: number | null;
  user: ObjectId;
  isEarn: boolean | null;
  status: number;
  createdAt: Date;
}