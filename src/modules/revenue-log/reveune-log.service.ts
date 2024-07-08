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

  public async getLatest(): Promise<IRevenueLogModel | null> {
    try {
      const result = await this.aggregateByPipeline([
        {
          $project: {
            _id: 0,
            revenueType: 1,
            revenue: 1,
            denom: 1,
            lastBalance: 1,
            created: 1
          }
        },
        { $sort: { created: -1 } },
        { $limit: 1 }
      ]);
      console.log(result);

      return result[0] as IRevenueLogModel;
    } catch (error) {
      logger.error("Error fetching the latest revenue log", error);
      return null;
    }
  }
}
