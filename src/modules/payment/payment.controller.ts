import { IPaymentModel } from '.';
import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";
import { PaymentService } from "./payment.service";
import { IAuthInfo } from '../auth/auth.types';
import UserService from '../user/user.service';
import AESWrapper from '@/utils/encryption/aes-wrapper';
import logger from '@/utils/logger';
import { ADMIN_WALLET_ADDRESS } from '@/config';
import { CDENOM_TOKENS } from '@/constant/crypto';

export class PaymentController {
  // Services
  private paymentService: PaymentService;
  private userService: UserService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.paymentService = new PaymentService();
    this.userService = new UserService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const paymentFilter = <FilterQuery<IPaymentModel>>{};
    const [item, count] = await Promise.all([
      this.paymentService.get(paymentFilter),
      this.paymentService.getCount(paymentFilter),
    ]);

    return {
      item,
      count,
    };
  };

  public getByName = async (name) => {
    const payment = await this.paymentService.getItem({ name });

    // need add to localizations
    if (!payment) {
      throw new CustomError(404, "Payment not found");
    }

    return payment;
  };

  public getById = async (paymentId) => {
    const payment = await this.paymentService.getItemById(paymentId);

    // need add to localizations
    if (!payment) {
      throw new CustomError(404, "Payment not found");
    }

    return payment;
  };

  public create = async (payment) => {
    try {
      return await this.paymentService.create(payment);
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  public update = async ({ id }, paymentData) => {
    try {
      const payment = await this.paymentService.updateById(id, paymentData);

      // need add to localizations
      if (!payment) {
        throw new CustomError(404, "Payment not found");
      }

      return payment;
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
    const payment = await this.paymentService.deleteById(id);

    // need add to localizations
    if (!payment) {
      throw new CustomError(404, "Payment not found");
    }
    return payment;
  };

  public userBalanceWithdraw = async (
    { amount, currency, address },
    { userId }: IAuthInfo
  ) => {
    const user = await this.userService.getItemById(userId);
    return {
      balance: user.wallet,
    };
  };

  public getAddress = async () => {
    try {
      const address = ADMIN_WALLET_ADDRESS ?? '';
      const aesKey = AESWrapper.generateKey();
      const encryptedAddress = AESWrapper.createAesMessage(aesKey, address);
      return {
        encryptedAddress,
        aesKey: aesKey.toString('base64')
      };
    } catch (ex) {
      const errorMessage = `Error encrypting address: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return {
        error: errorMessage
      };
    }
  };

  public userBalanceDeposit = async ({ amount, currency, address, txHash }, { userId }: IAuthInfo) => {
    console.log("balance deposit >>>>>>>>>>>>>>>>>> ");
    try {
      if (Object.keys(CDENOM_TOKENS).indexOf(currency) == -1) {
        throw new CustomError(409, 'Balance type is not supported');
      }
      const user = await this.userService.getItemById(userId);
      const updateParams = `wallet.${currency}`;

      const walletValue = user?.wallet?.[currency] ?? 0;
      let updateValue = 0;

      // user deposit crypto to admin wallet
      console.log("wallet value >>>>>>>>> ", walletValue);

      const resPayment = await this.paymentService.userBalanceDeposit({
        address: address,
        txHash: txHash ?? '',
        amount: amount,
        tokenType: currency,
      });

      console.log("update value >>>>>>>>> ", resPayment);
      if (!resPayment) {
        throw new CustomError(409, 'unable deposit');
      }
      updateValue = walletValue + amount;
      return await this.userService.updateUserBalance(userId, updateParams, updateValue);
    } catch (error) {
      console.log(error);
      throw new CustomError(409, 'updating balance error');
    }
  };
}
