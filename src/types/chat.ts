import { IChatUser } from './user';

export interface Ichat {
  _id: string;
  user: IChatUser;
  message: string;
  sentAt: Date;
}

export interface IChatClientToServerEvents {
  'auth': (token: string) => void;
  'join-chat': (_id: string) => void;
  message: (message: string) => void;
}

export interface IChatServerToClientEvents {
  message: (data: Ichat) => void;
  'previous-chat-history': (data: {
    message: string;
    chatHistories: Ichat[];
  }) => void;
}
