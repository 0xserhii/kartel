import { IUserModel } from "../user/user.interface";


export type TLeaderboardDocumentType = Pick<
  IUserModel,
  '_id' | 'username' | 'userEmail' | 'leaderboard' | 'avatar' | 'createdAt' | 'hasVerifiedAccount' | 'rank'
>;
