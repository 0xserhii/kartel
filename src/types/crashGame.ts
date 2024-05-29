import VIPLevelType from './vipLevel';

export interface GameStateType {
  _id: string;
  status: number;
  crashPoint: number | null;
  startedAt: Date | null;
  duration: number | null;
  players: { [key: string]: BetType };
  pending: { [key: string]: PendingBetType };
  pendingCount: number;
  pendingBets: PendingBetType[];
  privateSeed: string | null;
  privateHash: string | null;
  publicSeed: string | null;
  createdAt?: Date;
}

export interface BetType {
  playerID: string;
  username: string;
  avatar?: string;
  betAmount: number;
  status: number;
  level: VIPLevelType;
  stoppedAt?: number;
  autoCashOut?: number;
  winningAmount?: number;
  forcedCashout?: boolean;
  createdAt?: Date;
}

export interface PendingBetType {
  betAmount: number;
  autoCashOut?: number;
  username: string;
}

export type FormattedPlayerBetType = Pick<
  BetType,
  | 'playerID'
  | 'username'
  | 'avatar'
  | 'betAmount'
  | 'status'
  | 'level'
  | 'stoppedAt'
  | 'winningAmount'
>;

export interface FormattedGameHistoryType
  extends Pick<
    GameStateType,
    | '_id'
    | 'privateHash'
    | 'privateSeed'
    | 'publicSeed'
    | 'crashPoint'
    | 'createdAt'
  > { }
