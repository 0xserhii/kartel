// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { RevenueLog } from "@/utils/db";

// need add types
import { IRevenueLogModel } from "./reveune-log.interface";
import logger from "@/utils/logger";

export class RevenueLogService extends BaseService<IRevenueLogModel> {
  constructor() {
    super(RevenueLog);
  }

  fetchDashboardData = async (
  ): Promise<IRevenueLogModel[] | []> => {
    try {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const dashboardData = await this.aggregateByPipeline([
        {
          $match: {
            created: {
              $gte: oneWeekAgo,
              $lt: new Date()
            }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$created" } },
            latestEntry: { $last: "$$ROOT" }
          }
        },
        {
          $replaceRoot: { newRoot: "$latestEntry" }
        },
        {
          $project: {
            "revenueType": 1,
            "revenue": 1,
            "lastBalance": 1,
            "created": 1
          }
        },
        { $sort: { created: 1 } }
      ]);


      if (!dashboardData) {
        throw new Error("No data returned from aggregateByPipeline");
      }

      if (dashboardData.length === 0) {
        return [];
      }
      console.log(dashboardData);
      return dashboardData as IRevenueLogModel[];
    } catch (ex) {
      logger.error("Error finding dashboard data", ex);
      return [];
    }
  };
}
