import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { IWalletTransactionModel } from "./wallet-transaction.interface";
import { WalletTransactionService } from "./wallet-transaction.service";

export class WalletTransactionController {
  // Services
  private walletTransactionService: WalletTransactionService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.walletTransactionService = new WalletTransactionService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const walletTransactionFilter = <FilterQuery<IWalletTransactionModel>>{};
    const [item, count] = await Promise.all([
      this.walletTransactionService.get(walletTransactionFilter),
      this.walletTransactionService.getCount(walletTransactionFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const walletTransaction = await this.walletTransactionService.getItem({
      name,
    });

    // need add to localizations
    if (!walletTransaction) {
      throw new CustomError(404, "WalletTransaction not found");
    }

    return walletTransaction;
  };

  public getById = async (walletTransactionId) => {
    const walletTransaction =
      await this.walletTransactionService.getItemById(walletTransactionId);

    // need add to localizations
    if (!walletTransaction) {
      throw new CustomError(404, "WalletTransaction not found");
    }

    return walletTransaction;
  };

  public create = async (walletTransaction) => {
    try {
      return await this.walletTransactionService.create(walletTransaction);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, walletTransactionData) => {
    try {
      const walletTransaction = await this.walletTransactionService.updateById(
        id,
        walletTransactionData
      );

      // need add to localizations
      if (!walletTransaction) {
        throw new CustomError(404, "WalletTransaction not found");
      }

      return walletTransaction;
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      } else if (error.status) {
        throw new CustomError(error.status, error.message);
      } else {
        throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
      }
    }
  };

  public delete = async ({ id }) => {
    const walletTransaction =
      await this.walletTransactionService.deleteById(id);

    // need add to localizations
    if (!walletTransaction) {
      throw new CustomError(404, "WalletTransaction not found");
    }

    return walletTransaction;
  };
}
