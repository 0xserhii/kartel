import { IPaymentDocumentType } from '.';
// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { Payment } from "@/utils/db";

export class PaymentService extends BaseService<IPaymentDocumentType> {
  constructor() {
    super(Payment);
  }
}
