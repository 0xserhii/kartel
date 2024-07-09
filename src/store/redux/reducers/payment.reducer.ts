import { TAdminWallet } from "@/types/payment";
import { EPaymentSocketAction } from "./payment.type";

export interface IPaymentState {
  admin: TAdminWallet;
  txProgress: boolean;
  loginStatus: boolean;
  error: string;
}

const initialState: IPaymentState = {
  admin: {
    address1: "",
    address2: "",
  },
  loginStatus: false,
  txProgress: false,
  error: "",
};

export default function chatReducer(
  state = initialState,
  action
): IPaymentState {
  switch (action.type) {
    case EPaymentSocketAction.SET_ADMINWALLET:
      return {
        ...state,
        admin: action.payload,
      };

    case EPaymentSocketAction.WITHDRAW:
      return {
        ...state,
        txProgress: true,
      };

    case EPaymentSocketAction.PAYMENT_FAILED:
      return {
        ...state,
        error: action.payload,
        txProgress: false,
      };

    case EPaymentSocketAction.DEPOSIT:
      return {
        ...state,
        txProgress: true,
      };

    case EPaymentSocketAction.SET_TXPROGRESS:
      return {
        ...state,
        txProgress: true,
      };

    case EPaymentSocketAction.UPDATE_BALANCE:
      return {
        ...state,
        txProgress: false,
      };

    case EPaymentSocketAction.LOGIN_PAYMENT:
      return { ...state, loginStatus: true };

    default:
      return state;
  }
}
