import { IVIPLevelType } from '../user/user.types';
import { ICoinflipGameDocument } from './coinflip-game.interface';

export interface ICoinPlayer {
  _id: string;
  username: string;
  avatar: string;
  color: string;
  level: IVIPLevelType;
  isBot?: boolean;
}

export interface IParsedGame extends ICoinflipGameDocument {
  ownPrivateGame: boolean;
  inviteLink: string;
}
