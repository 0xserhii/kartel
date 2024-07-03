// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { User } from "@/utils/db";

// need add types
import { TLeaderboardDocumentType } from "./leaderboard.types";
import { ALLOW_GAME_LIST } from "@/config";

export class LeaderboardService extends BaseService<TLeaderboardDocumentType> {
  constructor() {
    super(User);
  }

  getTopLearderboards = async (count: number) => {
    let leaderboard: { [key: string]: any[] } = {};
    const gameList = ALLOW_GAME_LIST
    for (const game of gameList) {
      const topPipeline = [
        {
          $addFields: {
            totalBetAmount: {
              $sum: {
                $map: {
                  input: { $objectToArray: `$leaderboard.${game}` }, // Focus on specific game
                  as: 'denom',
                  in: '$$denom.v.betAmount',
                },
              },
            },
          },
        },
        { $sort: { totalBetAmount: -1 as 1 | -1 } },
        { $limit: count },
        {
          $project: {
            _id: 1,
            username: 1,
            email: 1,
            leaderboard: 1,
            avatar: 1,
            createdAt: 1,
            hasVerifiedAccount: 1,
            totalBetAmount: 1,
            rank: 1,
          }
        },
      ];
      const gameLeaderboard = await this.aggregateByPipeline(topPipeline);
      leaderboard[game] = gameLeaderboard;
    }

    return leaderboard;
  }
}
