export const USER_DATA = "USER_DATA";
export const INIT_USER_DATA = "INIT_USER_DATA";
export const SITE_BALANCE_UPDATE = "SITE_BALANCE_UPDATE";
export const SUBSCRIBE_USER = "SUBSCRIBE_USER";
export const DISCONNECT_USER = "DISCONNECT_USER";

export interface UserState {
  userData: { username: string; userEmail: string; _id: string };
  wallet: { value: number; denom: string };
}

interface UserAction {
  type: string;
  payload: any;
}

const initialState: any = {
  userData: { username: "", userEmail: "", _id: "" },
  wallet: { value: 0, denom: "" },
};

const userReducer = (state: any = initialState, action: UserAction): any => {
  switch (action.type) {
    case USER_DATA:
      return {
        userData: {
          username: action.payload.username,
          userEmail: action.payload.userEmail,
          _id: action.payload._id,
        },
      };

    case INIT_USER_DATA:
      return { userData: { username: "", userEmail: "", _id: "" } };

    case SITE_BALANCE_UPDATE:
      return {
        ...state,
        wallet: { value: action.payload.value, denom: action.payload.denom },
      };

    default:
      return state;
  }
};

export default userReducer;
