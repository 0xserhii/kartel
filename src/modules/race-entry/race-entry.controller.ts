import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { RaceEntryService, IRaceEntryModel } from ".";

export class RaceEntryController {
  // Services
  private raceEntryService: RaceEntryService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.raceEntryService = new RaceEntryService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const raceEntryFilter = <FilterQuery<IRaceEntryModel>>{};
    const [item, count] = await Promise.all([
      this.raceEntryService.get(raceEntryFilter),
      this.raceEntryService.getCount(raceEntryFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const raceEntry = await this.raceEntryService.getItem({ name });

    // need add to localizations
    if (!raceEntry) {
      throw new CustomError(404, "Race entry not found");
    }

    return raceEntry;
  };

  public getById = async (raceEntryId) => {
    const raceEntry = await this.raceEntryService.getItemById(raceEntryId);

    // need add to localizations
    if (!raceEntry) {
      throw new CustomError(404, "Race entry not found");
    }

    return raceEntry;
  };

  public create = async (raceEntry) => {
    try {
      return await this.raceEntryService.create(raceEntry);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, raceEntryData) => {
    try {
      const raceEntry = await this.raceEntryService.updateById(id, raceEntryData);

      // need add to localizations
      if (!raceEntry) {
        throw new CustomError(404, "Race entry not found");
      }

      return raceEntry;
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
    const raceEntry = await this.raceEntryService.deleteById(id);

    // need add to localizations
    if (!raceEntry) {
      throw new CustomError(404, "Race entry not found");
    }

    return raceEntry;
  };
}
