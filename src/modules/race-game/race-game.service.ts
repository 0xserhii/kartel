// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { RaceGame } from "@/utils/db";
import { IRaceGame } from "./race-game.interface";

export class RaceGameService extends BaseService<IRaceGame> {
  constructor() {
    super(RaceGame);
  }
}
