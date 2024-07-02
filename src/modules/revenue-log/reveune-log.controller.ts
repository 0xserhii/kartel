import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { RevenueLogService, IRevenueLogModel } from ".";

export class RevenueLogController {
  // Services
  private revenueLogService: RevenueLogService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.revenueLogService = new RevenueLogService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const revenueLogFilter = <FilterQuery<IRevenueLogModel>>{};
    const [item, count] = await Promise.all([
      this.revenueLogService.get(revenueLogFilter),
      this.revenueLogService.getCount(revenueLogFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const revenueLog = await this.revenueLogService.getItem({ name });

    // need add to localizations
    if (!revenueLog) {
      throw new CustomError(404, "Revenue log not found");
    }

    return revenueLog;
  };

  public getById = async (revenueLogId) => {
    const revenueLog = await this.revenueLogService.getItemById(revenueLogId);

    // need add to localizations
    if (!revenueLog) {
      throw new CustomError(404, "Revenue log not found");
    }

    return revenueLog;
  };

  public create = async (revenueLog) => {
    try {
      return await this.revenueLogService.create(revenueLog);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, revenueLogData) => {
    try {
      const revenueLog = await this.revenueLogService.updateById(id, revenueLogData);

      // need add to localizations
      if (!revenueLog) {
        throw new CustomError(404, "Revenue log not found");
      }

      return revenueLog;
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      } else if (error.status) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
      }
    }
  };

  public delete = async ({ id }) => {
    const revenueLog = await this.revenueLogService.deleteById(id);

    // need add to localizations
    if (!revenueLog) {
      throw new CustomError(404, "Revenue log not found");
    }

    return revenueLog;
  };
}
