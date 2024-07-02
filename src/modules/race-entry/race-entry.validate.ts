import Joi from "joi";

import * as validations from "@/utils/validations";

// import { EXAMPLE_ENUM } from "./race-entry.constant";

export const CreateRaceEntrySchema = Joi.object({
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});

export const UpdateRaceEntrySchema = Joi.object({
  id: validations.byId,
  name: Joi.string(),
  // type: validations.byEnum(EXAMPLE_ENUM),
});
