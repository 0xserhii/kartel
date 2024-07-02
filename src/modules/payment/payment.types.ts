export type TransactionDetails = {
  sender: string;
  receiver: string;
  amount: string;
  denom: string;
};

export enum ETokenType {
  usk = 'usk',
  kart = 'kart',
}

export type TWithDrawProps = {
  amount: number;
  tokenType: ETokenType;
  address: string;
};

export type TCheckDepositParam = {
  amount: number;
  tokenType: ETokenType;
  address: string;
  txHash: string;
};

export type TUpdateBalance = {
  balanceType: ETokenType;
  amount: number;
  txHash?: string;
  address: string;
};
