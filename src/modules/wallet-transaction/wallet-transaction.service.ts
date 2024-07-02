// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { WalletTransaction } from "@/utils/db";

import { IWalletTransactionModel } from "./wallet-transaction.interface";

export class WalletTransactionService extends BaseService<IWalletTransactionModel> {
  constructor() {
    super(WalletTransaction);
  }
}
