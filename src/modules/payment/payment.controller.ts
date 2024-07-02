import { IPaymentDocumentType } from '.';
import { FilterQuery } from "mongoose";

import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";
import { PaymentService } from "./payment.service";


export class PaymentController {
  // Services
  private paymentService: PaymentService;

  // Diff services
  private localizations: ILocalization;

  constructor() {
    this.paymentService = new PaymentService();

    this.localizations = localizations["en"];
  }

  public getAll = async () => {
    const paymentFilter = <FilterQuery<IPaymentDocumentType>>{};
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
}
