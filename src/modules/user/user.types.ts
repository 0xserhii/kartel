import { IUserDocumentModel } from "./user.interface";

export interface IVIPLevelType {
  name: string;
  wagerNeeded?: number;
  rakebackPercentage?: number;
  levelName?: string;
  levelColor?: string;
}


export type TChatUser = Pick<IUserDocumentModel, '_id' | 'username' | 'avatar' | 'hasVerifiedAccount' | 'createdAt'>;

export type TLeaderboardUserType = Pick<
  IUserDocumentModel,
  '_id' | 'username' | 'userEmail' | 'leaderboard' | 'avatar' | 'createdAt' | 'hasVerifiedAccount' | 'rank'
>;
