import mongoose from "mongoose";
import { Socket } from "socket.io";

import { IVIPLevelType } from "../user/user.types";

export interface IGameStateType {
  _id: mongoose.Types.ObjectId | null;
  status: number;
  crashPoint: number | null;
  startedAt: Date | null;
  duration: number | null;
  players: { [key: string]: IBetType };
  pending: { [key: string]: IPendingBetType };
  pendingCount: number;
  pendingBets: IPendingBetType[];
  privateSeed: string | null;
  privateHash: string | null;
  publicSeed: string | null;
  connectedUsers: { [key: string]: string };
  createdAt?: Date;
}

export interface IBetType {
  playerID: string;
  username: string;
  avatar?: string;
  betAmount: number;
  denom: string;
  status: number;
  level: IVIPLevelType;
  stoppedAt?: number;
  autoCashOut: number;
  winningAmount?: number;
  forcedCashout?: boolean;
  createdAt?: Date;
}

export interface IPendingBetType {
  betAmount: number;
  denom: string;
  autoCashOut?: number;
  username: string;
}

export type TFormattedPlayerBetType = Pick<
  IBetType,
  | "playerID"
  | "username"
  | "avatar"
  | "betAmount"
  | "denom"
  | "status"
  | "level"
  | "stoppedAt"
  | "winningAmount"
>;

export interface IFormattedGameHistoryType
  extends Pick<
    IGameStateType,
    | "_id"
    | "privateHash"
    | "privateSeed"
    | "publicSeed"
    | "crashPoint"
    | "createdAt"
  > { }
