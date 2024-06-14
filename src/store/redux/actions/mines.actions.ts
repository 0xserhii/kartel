import { EMinesSocketAction } from './../reducers/mines.type';

export function receiveError(error: string) {
  return {
    type: EMinesSocketAction.RECEIVE_ERROR,
    payload: error
  };
}

export function loginMinesServer() {
  return {
    type: EMinesSocketAction.LOGIN_MINES,
    payload: 'success'
  };
}

export function subscribeMinesServer() {
  return {
    type: EMinesSocketAction.SUBSCRIBE_MINES,
    payload: null
  };
}

export function minesgameRolling(position: number) {
  return {
    type: EMinesSocketAction.MINES_ROLLING,
    payload: position
  };
}

export function disconnectMinesServer() {
  return {
    type: EMinesSocketAction.DISCONNECT_MINES,
    payload: null
  };
}

export function startMinesgame(data: {
  betAmount: number;
  denom: string;
  betMinesCount: number;
}) {
  return {
    type: EMinesSocketAction.CREATE_NEW_MINESGAME,
    payload: data
  };
}

export function cashoutgame() {
  console.log("cash out game >>>>>>>>>>> reducer")
  return {
    type: EMinesSocketAction.CASHOUT_MINESGAME,
    payload: null
  };
}

export function rollingMinesgame(position: number) {
  return {
    type: EMinesSocketAction.MINES_ROLLING,
    payload: position
  };
}

export function resetGameState() {
  return {
    type: EMinesSocketAction.RESET_GAME_STATE,
    payload: null
  };
}

export function minesgameRolled(data: boolean | null) {
  console.log(data)
  return {
    type: EMinesSocketAction.MINESGAME_ROLLED,
    payload: data
  };
}