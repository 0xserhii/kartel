import {
  DISCONNECT_USER,
  INIT_USER_DATA,
  REMEMBERME,
  REMOVE_CREDENTIALS,
  SET_CREDENTIALS,
  SITE_BALANCE_UPDATE,
  USER_DATA,
} from "../reducers/user.reducer";

export type TUserData = {
  userData: {
    username: string;
    _id: string;
    role: string;
  };
};

export function userData(data: any) {
  return {
    type: USER_DATA,
    payload: data,
  };
}

export function initUserData() {
  return {
    type: INIT_USER_DATA,
    payload: null,
  };
}

export function rememberMe(remember: boolean) {
  return {
    type: REMEMBERME,
    payload: remember,
  };
}

export function setCredential(credentials: {
  username: string;
  password: string;
}) {
  return {
    type: SET_CREDENTIALS,
    payload: credentials,
  };
}

export function removeCredential() {
  return {
    type: REMOVE_CREDENTIALS,
    payload: null,
  };
}

export function siteBalanceUpdate(wallet: { value: number; denom: string }) {
  return {
    type: SITE_BALANCE_UPDATE,
    payload: wallet,
  };
}

export function disconnectUserServer() {
  return {
    type: DISCONNECT_USER,
    payload: null,
  };
}
