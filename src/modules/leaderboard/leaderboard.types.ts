import { IUserDocumentModel } from "../user/user.interface";


export type TLeaderboardDocumentType = Pick<
  IUserDocumentModel,
  '_id' | 'username' | 'userEmail' | 'leaderboard' | 'avatar' | 'createdAt' | 'hasVerifiedAccount' | 'rank'
>;
