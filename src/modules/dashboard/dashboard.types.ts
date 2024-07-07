import { IUserModel } from "../user/user.interface";

export type TDashboardDocumentType = Pick<
  IUserModel,
  | "_id"
  | "username"
  | "userEmail"
  | "leaderboard"
  | "avatar"
  | "createdAt"
  | "hasVerifiedAccount"
  | "rank"
>;
