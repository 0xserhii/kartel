import Joi from "joi";

import * as validations from "@/utils/validations";

// import { EXAMPLE_ENUM } from "./payment.constant";

export const CreateWalletTransactionSchema = Joi.object({
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});

export const UpdateWalletTransactionSchema = Joi.object({
  id: validations.byId,
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});
