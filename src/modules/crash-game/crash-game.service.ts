// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { CrashGame } from "@/utils/db";
import { ICrashGameModel } from "./crash-game.interface";
import { CGAME_STATES } from "./crash-game.constant";

export class CrashGameService extends BaseService<ICrashGameModel> {
  constructor() {
    super(CrashGame);
  }

  public getUnfinishedGames = async () => {
    return this.database.find({
      $or: [{ status: CGAME_STATES.Starting }, { status: CGAME_STATES.Blocking }, { status: CGAME_STATES.InProgress }],
    });
  }

}
