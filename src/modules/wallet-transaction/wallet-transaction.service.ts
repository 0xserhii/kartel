import { IWalletTransactionModel } from "./wallet-transaction.interface";

// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { WalletTransaction } from "@/utils/db";

export class WalletTransactionService extends BaseService<IWalletTransactionModel> {
  constructor() {
    super(WalletTransaction);
  }
}
