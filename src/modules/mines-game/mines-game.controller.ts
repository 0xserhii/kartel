import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { MinesGameService } from "./mines-game.service";
import { IMinesGameDocument } from "./mines-game.interface";

export class MinesGameController {
  // Services
  private minesGameService: MinesGameService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.minesGameService = new MinesGameService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const minesGameFilter = <FilterQuery<IMinesGameDocument>>{};
    const [item, count] = await Promise.all([
      this.minesGameService.get(minesGameFilter),
      this.minesGameService.getCount(minesGameFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const minesGame = await this.minesGameService.getItem({ name });

    // need add to localizations
    if (!minesGame) {
      throw new CustomError(404, "Mines game not found");
    }

    return minesGame;
  };

  public getById = async (minesGameId) => {
    const minesGame = await this.minesGameService.getItemById(minesGameId);

    // need add to localizations
    if (!minesGame) {
      throw new CustomError(404, "Mines game not found");
    }

    return minesGame;
  };

  public create = async (minesGame) => {
    try {
      return await this.minesGameService.create(minesGame);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, minesGameData) => {
    try {
      const minesGame = await this.minesGameService.updateById(id, minesGameData);

      // need add to localizations
      if (!minesGame) {
        throw new CustomError(404, "Mines game not found");
      }

      return minesGame;
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
    const minesGame = await this.minesGameService.deleteById(id);

    // need add to localizations
    if (!minesGame) {
      throw new CustomError(404, "Mines game not found");
    }

    return minesGame;
  };
}
