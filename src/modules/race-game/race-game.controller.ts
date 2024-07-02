import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { RaceGameService, IRaceGame } from ".";

export class RaceGameController {
  // Services
  private raceGameService: RaceGameService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.raceGameService = new RaceGameService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const raceGameFilter = <FilterQuery<IRaceGame>>{};
    const [item, count] = await Promise.all([
      this.raceGameService.get(raceGameFilter),
      this.raceGameService.getCount(raceGameFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const raceGame = await this.raceGameService.getItem({ name });

    // need add to localizations
    if (!raceGame) {
      throw new CustomError(404, "Race not found");
    }

    return raceGame;
  };

  public getById = async (raceGameId) => {
    const raceGame = await this.raceGameService.getItemById(raceGameId);

    // need add to localizations
    if (!raceGame) {
      throw new CustomError(404, "Race not found");
    }

    return raceGame;
  };

  public create = async (raceGame) => {
    try {
      return await this.raceGameService.create(raceGame);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, raceGameData) => {
    try {
      const raceGame = await this.raceGameService.updateById(id, raceGameData);

      // need add to localizations
      if (!raceGame) {
        throw new CustomError(404, "Race not found");
      }

      return raceGame;
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
    const raceGame = await this.raceGameService.deleteById(id);

    // need add to localizations
    if (!raceGame) {
      throw new CustomError(404, "Race not found");
    }

    return raceGame;
  };
}
