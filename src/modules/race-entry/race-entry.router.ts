import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";

import {
  RaceEntryController,
} from ".";

export default class RaceEntryRouter extends BaseRouter {
  private raceEntryController: RaceEntryController;

  constructor() {
    super();

    this.raceEntryController = new RaceEntryController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.raceEntryController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(CreateRaceEntrySchema, mapProperty.getBody),
      actionHandler(this.raceEntryController.create, mapProperty.getBody)
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.raceEntryController.getByName,
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
      // validateSchema(CreateExampleSchema, mapProperty.getBody),
      // actionHandler(
      //   this.exampleController.getById,
      //   mapPropertyExample.getIdFromParamsWithMe
      // )
    );

    this.router.put(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(UpdateExampleSchema, mapProperty.getBody),
      actionHandler(this.raceEntryController.update, [
        mapProperty.getNameFromParam,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.raceEntryController.delete, mapProperty.getNameFromParam)
    );
  }
}
