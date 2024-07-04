import { IChat } from "@/types";
import { EChatSocketAction } from "./chat.type";

export interface IChatState {
  chatHistory: IChat[];
  loginStatus: boolean;
  error: string;
}

const initialState = {
  chatHistory: [],
  loginStatus: false,
  error: "",
};

export default function chatReducer(state = initialState, action): IChatState {
  switch (action.type) {
    case EChatSocketAction.RECEIVE_CHAT_HISTORY:
      return {
        ...state,
        chatHistory: [...(action.payload as IChat[]), ...state.chatHistory],
      };

    case EChatSocketAction.RECEIVE_MSG:
      return {
        ...state,
        chatHistory: [...state.chatHistory, action.payload as IChat],
      };

    case EChatSocketAction.ERROR:
      return {
        ...state,
        error: action.payload,
      };

    case EChatSocketAction.LOGIN_CHAT:
      return { ...state, loginStatus: true };

    default:
      return state;
  }
}
