// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { MinesGame } from "@/utils/db";

// need add types
import { IMinesGameDocument } from "./mines-game.interface";

export class MinesGameService extends BaseService<IMinesGameDocument> {
  constructor() {
    super(MinesGame);
  }
}
