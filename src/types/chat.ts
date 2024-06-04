import { IChatUser } from './user';

export interface IChat {
  _id: string;
  user: IChatUser;
  message: string;
  sentAt: Date;
}

export enum EChatSocketEvent {
  LOGIN = 'auth',
  JOIN_CHAT = 'join_chat',
  SEND_MSG = 'message',
  RECEIVE_MSG = 'message',
  DISCONNECT_CHAT = 'disconnect',
  GET_CHAT_HISTORY = 'previous-chat-history'
}

export interface IChatClientToServerEvents {
  [EChatSocketEvent.LOGIN]: (token: string) => void;
  [EChatSocketEvent.JOIN_CHAT]: (_id: string) => void;
  [EChatSocketEvent.SEND_MSG]: (message: string) => void;
}

export interface IChatServerToClientEvents {
  [EChatSocketEvent.RECEIVE_MSG]: (data: IChat) => void;
  [EChatSocketEvent.GET_CHAT_HISTORY]: (data: {
    message: string;
    chatHistories: IChat[];
  }) => void;
}
