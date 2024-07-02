// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { RevenueLog } from "@/utils/db";

// need add types
import { IRevenueLogModel } from "./reveune-log.interface";

export class RevenueLogService extends BaseService<IRevenueLogModel> {
  constructor() {
    super(RevenueLog);
  }
}
