import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";

import {
  CreateRaceGameSchema,
  RaceGameController,
  UpdateRaceGameSchema,
} from ".";

export default class RaceGameRouter extends BaseRouter {
  private raceGameController: RaceGameController;

  constructor() {
    super();

    this.raceGameController = new RaceGameController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.raceGameController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(CreateRaceGameSchema, mapProperty.getBody),
      actionHandler(this.raceGameController.create, mapProperty.getBody)
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.raceGameController.getByName,
        mapProperty.getNameFromParam
      )
    );

    this.router.get(
      "/:id",
      checkPermissions(),
      // validateSchema(
      //   validations.byId,
      //   mapPropertyExample.getIdFromParamsWithMe
      // ),
      validateSchema(CreateRaceGameSchema, mapProperty.getBody)
      // actionHandler(
      //   this.raceGameController.getById,
      //   mapPropertyExample.getIdFromParamsWithMe
      // )
    );

    this.router.put(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(UpdateRaceGameSchema, mapProperty.getBody),
      actionHandler(this.raceGameController.update, [
        mapProperty.getNameFromParam,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(
        this.raceGameController.delete,
        mapProperty.getNameFromParam
      )
    );
  }
}
