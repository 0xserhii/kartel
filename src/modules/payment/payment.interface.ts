import { Document } from "mongoose";
import { Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { kujiraQueryClient } from 'kujira.js/lib/cjs/queryClient.js';

export interface IPaymentModel extends Document {
  userId?: string;
  walletAddress?: string;
  type: string;
  amount: number;
  txHash: string;
  createdAt: Date;
}


export interface IClient {
  tmClient: Tendermint37Client;
  querier: ReturnType<typeof kujiraQueryClient>;
}