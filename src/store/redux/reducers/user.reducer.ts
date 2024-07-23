export const USER_DATA = "USER_DATA";
export const INIT_USER_DATA = "INIT_USER_DATA";
export const SITE_BALANCE_UPDATE = "SITE_BALANCE_UPDATE";
export const DISCONNECT_USER = "DISCONNECT_USER";
export const REMEMBERME = "REMEMBERME";
export const SET_CREDENTIALS = "SET_CREDENTIALS";
export const REMOVE_CREDENTIALS = "REMOVE_CREDENTIALS";

export interface UserState {
  userData: {
    username: string;
    _id: string;
    role: string;
    password: string;
    signAddress: string;
  };
  wallet: { value: number; denom: string };
  remember: boolean;
  credentials: { username: string; password: string };
}

interface UserAction {
  type: string;
  payload: any;
}

const initialState: UserState = {
  userData: { username: "", _id: "", role: "", password: "", signAddress: "" },
  wallet: { value: 0, denom: "" },
  remember: false,
  credentials: { username: "", password: "" },
};

const userReducer = (state: any = initialState, action: UserAction): any => {
  switch (action.type) {
    case USER_DATA:
      return {
        ...state,
        userData: {
          username: action.payload.username,
          _id: action.payload._id,
          role: action.payload?.role,
          password: action.payload?.password,
          signAddress: action.payload?.signAddress,
        },
      };

    case INIT_USER_DATA:
      return {
        ...state,
        userData: {
          username: "",
          _id: "",
          role: "",
          password: "",
          signAddress: "",
        },
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
        credentials: { username: "", password: "" },
      };

    default:
      return state;
  }
};

export default userReducer;
