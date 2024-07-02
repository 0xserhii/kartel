// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { Payment } from "@/utils/db";

import { IPaymentModel } from ".";

export class PaymentService extends BaseService<IPaymentModel> {
  constructor() {
    super(Payment);
  }
}
