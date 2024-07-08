// need add model to mongo index file
import { ALLOW_GAME_LIST } from "@/config";
import BaseService from "@/utils/base/service";
import { User } from "@/utils/db";

// need add types
import { TLeaderboardDocumentType } from "./leaderboard.types";
import logger from "@/utils/logger";

export class LeaderboardService extends BaseService<TLeaderboardDocumentType> {
  private gameList = ALLOW_GAME_LIST;
  constructor() {
    super(User);
  }

  getTopLearderboards = async (count: number) => {
    const leaderboard: { [key: string]: { usk: any[], kart: any[] } } = {};

    for (const game of this.gameList) {
      const createPipeline = (denomKey: string) => [
        {
          $addFields: {
            totalBetAmount: {
              $sum: {
                $map: {
                  input: { $objectToArray: `$leaderboard.${game}` }, // Focus on specific game
                  as: "denom",
                  in: {
                    $cond: [
                      { $eq: ["$$denom.k", denomKey] },
                      "$$denom.v.betAmount",
                      0
                    ]
                  },
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
          },
        },
      ];

      const gameUskLeaderboard = await this.aggregateByPipeline(createPipeline("usk"));
      const gameKartLeaderboard = await this.aggregateByPipeline(createPipeline("kart"));
      leaderboard[game] = {
        usk: gameUskLeaderboard,
        kart: gameKartLeaderboard
      };
    }
    return leaderboard;
  };

  fetchTopPlayers = async (count: number): Promise<{ [key: string]: { winners: any[], losers: any[] } } | []> => {
    try {
      const dashboard: { [key: string]: { winners: any[], losers: any[] } } = {};

      const createPipeline = (game: string, sortOrder: 1 | -1) => [
        {
          $addFields: {
            totalProfit: {
              $sum: {
                $map: {
                  input: { $objectToArray: `$leaderboard.${game}` },
                  as: 'denom',
                  in: {
                    $subtract: ['$$denom.v.winAmount', '$$denom.v.betAmount']
                  },
                },
              },
            },
          },
        },
        { $sort: { totalProfit: sortOrder } },
        { $limit: count },
      ];

      const projectFields = {
        _id: 1,
        username: 1,
        email: 1,
        leaderboard: 1,
        avatar: 1,
        createdAt: 1,
        hasVerifiedAccount: 1,
        totalWinAmount: 1,
        rank: 1,
      };

      for (const game of this.gameList) {
        const winnersPipeline = createPipeline(game, -1);
        const losersPipeline = createPipeline(game, 1);

        const winners = await User.aggregate(winnersPipeline).project(projectFields);
        const losers = await User.aggregate(losersPipeline).project(projectFields);

        dashboard[game] = { winners, losers };
      }

      return dashboard;
    } catch (ex) {
      logger.error("Error finding top players", ex);
      return [];
    }
  }
}
