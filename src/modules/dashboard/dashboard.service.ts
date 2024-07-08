// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { Dashboard } from "@/utils/db";

// need add types
import { IDashboardModel } from "./dashboard.interface";
import { EFilterDate } from "./dashboard.constant";

export class DashboardService extends BaseService<IDashboardModel> {

  constructor() {
    super(Dashboard);
  }

  public async saveRevenulogData(revenueLogs: IDashboardModel, insertDate: Date): Promise<void> {
    try {
      insertDate.setMilliseconds(0)
      await this.create({ ...revenueLogs, insertDate });
    } catch (error) {
      console.log("Error saving revenue logs:", error);
    }
  }

  public async getDashboardChart(dateType: EFilterDate): Promise<IDashboardModel[]> {
    let date = 60;
    let limit = 288;

    if (dateType === EFilterDate.day) {
      date = 60
      limit = 24
    } else if (dateType === EFilterDate.week) {
      date = 60 * 24
      limit = 7
    } else if (dateType === EFilterDate.month) {
      date = 60 * 24
      limit = 30
    } else {
      date = 60 * 24 * 30
      limit = 12
    }

    const revenueLogs = await this.aggregateByPipeline([
      {
        $addFields:
        {
          insertMod: {
            $mod: [
              {
                $toLong: "$insertDate"
              },
              1000 * 60 * date
            ]
          }
        }
      },
      {
        $match:
        {
          insertMod: 0
        }
      },
      { $limit: limit }
    ]);

    const lastRevenueLog = await this.aggregateByPipeline([
      {
        $sort: {
          insertDate: -1
        }
      },
      { $limit: 1 }
    ])

    if (revenueLogs.length === 0) {
      return lastRevenueLog
    }
    return revenueLogs;
  }
}
