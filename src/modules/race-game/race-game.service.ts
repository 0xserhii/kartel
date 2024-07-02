// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { RaceGame } from "@/utils/db";
import { IRaceGameModel } from "./race-game.interface";

export class RaceGameService extends BaseService<IRaceGameModel> {
  constructor() {
    super(RaceGame);
  }
}
