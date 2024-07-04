
export enum EPaymentEvents {
  login = "auth",
  withdraw = "withdraw",
  deposit = "deposit",
  setAdminWallet = "set-admin-wallet",
  paymentFailed = "payment-failed",
  updateBalance = "updateBalance"
}

export type TSocketDepositParam = {
  amount: number,
  currency: string,
  address: string,
  txHash: string
}

export type TUpdateBalanceParam = {
  walletValue: number,
  denom: string
}

export type TSocketWithDrawParam = {
  amount: number,
  currency: string,
  address: string
}

export type TAdminWallet = {
  key: string,
  address: string
}

export interface IPaymentClientToServerEvents {
  [EPaymentEvents.login]: (token: string) => void;
  [EPaymentEvents.withdraw]: (data: TSocketWithDrawParam) => void;
  [EPaymentEvents.deposit]: (data: TSocketDepositParam) => void;
}

export interface IPaymentServerToClientEvents {
  [EPaymentEvents.setAdminWallet]: (data: TAdminWallet) => void;
  [EPaymentEvents.updateBalance]: (data: TUpdateBalanceParam) => void;
}
