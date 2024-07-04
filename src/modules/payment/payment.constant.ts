import { BigNumber } from "@ethersproject/bignumber";

export enum EXAMPLE_ENUM {
  EXAMPLE_FIRST = "EXAMPLE_FIRST",
  EXAMPLE_TWO = "EXAMPLE_TWO",
}

export const toHuman = (amount: BigNumber, decimals: number): number => {
  return parseFloat(amount.div(BigNumber.from(10).pow(decimals)).toString());
};

export const fromHumanString = (
  amount: string,
  decimals: number
): BigNumber => {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
};

export const mulDec = (a: BigNumber, x: number): BigNumber => {
  return a.mul(BigNumber.from(x));
};

export const divToNumber = (a: BigNumber, b: BigNumber): number => {
  return parseFloat(a.div(b).toString());
};

export const bigCompare = (a: BigNumber, b: BigNumber): 0 | 1 | -1 => {
  if (a.eq(b)) {
    return 0;
  }

  return a.gt(b) ? 1 : -1;
};

export enum EPaymentEvents {
  login = "auth",
  withdraw = "withdraw",
  deposit = "deposit",
  setAdminWallet = "set-admin-wallet",
  updateBalance = "updateBalance",
  paymentFailed = "payment-failed",
}

// 30 seconds
export const CAllowTimeDiff = 30 * 1000;
