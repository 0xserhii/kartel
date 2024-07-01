import { DISCONNECT_USER, INIT_USER_DATA, SITE_BALANCE_UPDATE, SUBSCRIBE_USER, USER_DATA } from '../reducers/user.reducer';

export type TUserData = {
  userData: {
    username: string;
    userEmail: string;
    _id: string;
  };
};

export function userData(data: any) {
  return {
    type: USER_DATA,
    payload: data
  };
}

export function initUserData() {
  return {
    type: INIT_USER_DATA,
    payload: null
  };
}

export function siteBalanceUpdate(wallet: { value: number, denom: string }) {
  console.log(wallet)
  return {
    type: SITE_BALANCE_UPDATE,
    payload: wallet
  }
}

export function subscribeUserServer() {
  return {
    type: SUBSCRIBE_USER,
    payload: null
  };
}

export function disconnectUserServer() {
  return {
    type: DISCONNECT_USER,
    payload: null
  };
}
