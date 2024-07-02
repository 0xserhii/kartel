// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { User } from "@/utils/db";

// need add types
import { TLeaderboardDocumentType } from "./leaderboard.types";

export class LeaderboardService extends BaseService<TLeaderboardDocumentType> {
  constructor() {
    super(User);
  }
}
