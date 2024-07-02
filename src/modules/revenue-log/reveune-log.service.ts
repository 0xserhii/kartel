// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { RevenueLog } from "@/utils/db";

// need add types
import { IRevenueLog } from "./reveune-log.interface";

export class RevenueLogService extends BaseService<IRevenueLog> {
  constructor() {
    super(RevenueLog);
  }
}
