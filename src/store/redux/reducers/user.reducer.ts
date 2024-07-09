export const USER_DATA = "USER_DATA";
export const INIT_USER_DATA = "INIT_USER_DATA";
export const SITE_BALANCE_UPDATE = "SITE_BALANCE_UPDATE";
export const SUBSCRIBE_USER = "SUBSCRIBE_USER";
export const DISCONNECT_USER = "DISCONNECT_USER";
export const REMEMBERME = "REMEMBERME";
export const SET_CREDENTIALS = "SET_CREDENTIALS";
export const REMOVE_CREDENTIALS = "REMOVE_CREDENTIALS";

export interface UserState {
  userData: { username: string; userEmail: string; _id: string; role: string };
  wallet: { value: number; denom: string };
  remember: boolean;
  credentials: { email: string; password: string };
}

interface UserAction {
  type: string;
  payload: any;
}

const initialState: UserState = {
  userData: { username: "", userEmail: "", _id: "", role: "" },
  wallet: { value: 0, denom: "" },
  remember: false,
  credentials: { email: "", password: "" },
};

const userReducer = (state: any = initialState, action: UserAction): any => {
  switch (action.type) {
    case USER_DATA:
      return {
        ...state,
        userData: {
          username: action.payload.username,
          userEmail: action.payload.userEmail,
          _id: action.payload._id,
          role: action.payload?.role,
        },
      };

    case INIT_USER_DATA:
      return {
        ...state,
        userData: { username: "", userEmail: "", _id: "", role: "" },
        wallet: { value: 0, denom: "" },
      };

    case SITE_BALANCE_UPDATE:
      return {
        ...state,
        wallet: { value: action.payload.value, denom: action.payload.denom },
      };

    case REMEMBERME:
      return {
        ...state,
        remember: action.payload,
      };

    case SET_CREDENTIALS:
      return {
        ...state,
        credentials: action.payload,
      };

    case REMOVE_CREDENTIALS:
      return {
        ...state,
        credentials: { email: "", password: "" },
      };

    default:
      return state;
  }
};

export default userReducer;
