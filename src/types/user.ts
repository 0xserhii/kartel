export interface IChatUser {
  _id: string;
  username: string;
  avatar: string;
  hasVerifiedAccount: boolean;
  createdAt: Date;
}

export interface IUserServerToClientEvents {
  'update-wallet': (wallet, denom) => void;
}

export interface IUserClientToServerEvents {}
