import { LeaderboardType } from './leaderboard';

export interface ILeaderboardClientToServerEvents {}
export interface ILeaderboardServerToClientEvents {
  'leaderboard-fetch-all': (data: {
    message: string;
    leaderboard: LeaderboardType;
  }) => void;
}
