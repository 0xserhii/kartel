import { ObjectId, Types } from "mongoose";

export interface IMinesGameDocument extends Document {
  _id: Types.ObjectId;
  betAmount: number;
  denom: string;
  betMinesCount: number;
  cashOut: boolean;
  miningStep: number;
  privateSeed?: string;
  privateHash: string;
  publicSeed: string | null;
  mines: number[];
  results: number[];
  probabilities: number[];
  user: ObjectId;
  status: number;
  createdAt: Date;
}
