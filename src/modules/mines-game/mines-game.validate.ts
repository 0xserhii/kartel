import Joi from "joi";

import * as validations from "@/utils/validations";

// import { EXAMPLE_ENUM } from "./mines-game.constant";

export const CreateMinesGameSchema = Joi.object({
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});

export const UpdateMinesGameSchema = Joi.object({
  id: validations.byId,
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});
