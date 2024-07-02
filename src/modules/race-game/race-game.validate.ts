import Joi from "joi";

import * as validations from "@/utils/validations";

// import { EXAMPLE_ENUM } from "./race-game.constant";

export const CreateRaceGameSchema = Joi.object({
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});

export const UpdateRaceGameSchema = Joi.object({
  id: validations.byId,
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});
