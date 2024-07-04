export enum EPaymentSocketAction {
  LOGIN_PAYMENT = "(PAYMENT)-LOGIN_PAYMENT",
  SUBSCRIBE_PAYMENT = "(PAYMENT)-SUBSCRIBE_PAYMENT",
  WITHDRAW = "(PAYMENT)-WITHDRAW",
  DEPOSIT = "(PAYMENT)-DEPOSIT",
  SET_ADMINWALLET = "(PAYMENT)-SET_ADMINWALLET",
  PAYMENT_FAILED = "(PAYMENT)-FAILED",
  SET_TXPROGRESS = "(PAYMENT)-SET_TXPROGRESS",
  UPDATE_BALANCE = "(PAYMENT)-UPDATE_BALANCE",
  DISCONNECT_PAYMENT = "(PAYMENT)-DISCONNECT_PAYMENT",
  ERROR = "(PAYMENT)-ERROR",
}
