import { Document, ObjectId } from "mongoose";

export interface ICoinflipGameModel extends Document {
  betAmount: number;
  denom: string;
  betCoinsCount: number;
  betSide: boolean;
  isBotCalled: boolean;
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
