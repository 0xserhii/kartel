import { EMinesSocketAction } from './mines.type';

interface IMinesState {
  loginStatus: boolean;
  gameResult: null | boolean;
  rolling: boolean;
  error: string;
}

const initialState = {
  loginStatus: false,
  gameResult: null,
  rolling: false,
  error: ''
};

export default function minesReducer(
  state: IMinesState = initialState,
  action
): IMinesState {
  switch (action.type) {

    case EMinesSocketAction.LOGIN_MINES:
      return { ...state, loginStatus: true };

    case EMinesSocketAction.MINES_ROLLING:
      return { ...state, rolling: true };

    case EMinesSocketAction.MINESGAME_ROLLED:
      console.log(action.payload);
      return { ...state, gameResult: action.payload };

    case EMinesSocketAction.RECEIVE_ERROR:
      console.log(action.payload);
      return { ...state, error: action.payload };

    default:
      return state;
  }
}
