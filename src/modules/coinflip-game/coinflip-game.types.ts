import { IVIPLevelType } from "../user/user.types";
import { ICoinflipGameModel } from "./coinflip-game.interface";

export interface ICoinPlayer {
  _id: string;
  username: string;
  avatar: string;
  color: string;
  level: IVIPLevelType;
  isBot?: boolean;
}

export interface IParsedGame extends ICoinflipGameModel {
  ownPrivateGame: boolean;
  inviteLink: string;
}
