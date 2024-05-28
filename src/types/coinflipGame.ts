import VIPLevelType from './vipLevel';

export interface ICoinPlayer {
  _id: string;
  username: string;
  avatar: string;
  color: string;
  level: VIPLevelType;
  isBot?: boolean;
}
