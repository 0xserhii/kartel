export const USER_DATA = 'USER_DATA';
export const INIT_USER_DATA = 'INIT_USER_DATA';

export interface UserState {
  userData: { username: string; userEmail: string; _id: string };
}

interface UserAction {
  type: string;
  payload: { username: string; userEmail: string; _id: string };
}

const initialState: UserState = {
  userData: { username: '', userEmail: '', _id: '' }
};

const modalReducer = (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case USER_DATA:
      return { userData: action.payload };
    case INIT_USER_DATA:
      return { userData: { username: '', userEmail: '', _id: '' } };
    default:
      return state;
  }
};

export default modalReducer;
