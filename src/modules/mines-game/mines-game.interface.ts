import { Document, ObjectId } from "mongoose";

export interface IMinesGameModel extends Document {
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
