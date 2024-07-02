import Joi from "joi";

import * as validations from "@/utils/validations";

// import { EXAMPLE_ENUM } from "./reveune-log.constant";

export const CreateRevenueLogSchema = Joi.object({
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});

export const UpdateRevenueLogSchema = Joi.object({
  id: validations.byId,
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});
