import { IClient, IPaymentModel, PaymentController, TCheckDepositParam, TransactionDetails, fromHumanString } from '.';
// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { Payment } from "@/utils/db";
import logger from '@/utils/logger';
import { ADMIN_WALLET_ADDRESS, BLOCKCHAIN_RPC_ENDPOINT } from '@/config';
import { HttpBatchClient, Tendermint37Client } from '@cosmjs/tendermint-rpc';
import { KujiraQueryClient, kujiraQueryClient } from 'kujira.js';
import { CDENOM_TOKENS } from '@/constant/crypto';

export class PaymentService extends BaseService<IPaymentModel> {

  private instance: IClient | null = null;
  public rpcClient = new HttpBatchClient(BLOCKCHAIN_RPC_ENDPOINT, { dispatchInterval: 2000 });

  constructor() {
    super(Payment);
  }

  public createClient = async (): Promise<IClient> => {
    console.log('createClient', { rpc: BLOCKCHAIN_RPC_ENDPOINT });
    const tmClient = await Tendermint37Client.create(this.rpcClient);
    const querier = kujiraQueryClient({ client: tmClient });
    return { tmClient, querier };
  };

  private getClient = async (): Promise<IClient> => {
    if (!this.instance) {
      this.instance = await this.createClient();
    }
    return this.instance;
  };

  private getTransactionDetails = (txDetailsString: string): TransactionDetails | null => {
    try {
      const txDetailsArray = JSON.parse(txDetailsString);

      let sender = '';
      let receiver = '';
      let amount = '';
      let denom = '';

      txDetailsArray.forEach((tx: any) => {
        tx.events.forEach((event: any) => {
          if (event.type === 'message') {
            event.attributes.forEach((attr: any) => {
              if (attr.key === 'sender') {
                sender = attr.value;
              }
            });
          }
          if (event.type === 'transfer') {
            event.attributes.forEach((attr: any) => {
              if (attr.key === 'recipient') {
                receiver = attr.value;
              }
              if (attr.key === 'amount') {
                const amountDenom = attr.value.match(/^(\d+)(.*)$/);
                if (amountDenom) {
                  amount = amountDenom[1];
                  denom = amountDenom[2];
                }
              }
            });
          }
        });
      });

      if (sender && receiver && amount && denom) {
        return { sender, receiver, amount, denom };
      } else {
        console.error('Failed to extract all transaction details.');
        return null;
      }
    } catch (error) {
      console.error('Error parsing transaction details:', error);
      return null;
    }
  };

  public checkDepositPayment = async (payload: TCheckDepositParam) => {
    try {
      console.log('check deposit user', { payload });
      const kujiarActionClient = await this.getClient();
      const txDetails = await kujiarActionClient.querier.tx.getTx(payload.txHash);

      if (txDetails.txResponse?.rawLog) {
        const txLowLogs: string = txDetails.txResponse?.rawLog;
        const checkDetails = this.getTransactionDetails(txLowLogs);
        if (checkDetails?.amount !== fromHumanString(payload.amount.toString(), 6).toString()) {
          return false;
        }
        if (checkDetails?.sender !== payload.address) {
          return false;
        }
        if (checkDetails?.receiver !== ADMIN_WALLET_ADDRESS) {
          return false;
        }
        if (checkDetails?.denom !== CDENOM_TOKENS[payload.tokenType]) {
          return false;
        }
      } else {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  public userBalanceDeposit = async (data) => {
    try {
      const checkParam = {
        amount: data.amount,
        tokenType: data.tokenType,
        address: data.address,
        txHash: data.txHash,
      };
      const duplicateTx = await this.getItem({ txHash: data.txHash });
      if (!duplicateTx) {
        const depositStatus = await this.checkDepositPayment(checkParam);
        if (depositStatus) {
          const newPayment = await this.create({
            walletAddress: data.address,
            amount: data.amount,
            txHash: data.txHash,
          });
          return newPayment;
        }
        return null;
      }
      return null;
    } catch (ex) {
      const errorMessage = `Error finding all payments: $${(ex as Error).message}`;
      logger.error(errorMessage);
      return null;
    }
  };


}
