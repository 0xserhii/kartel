import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";

import {
  CrashGameController,
} from ".";

export default class CrashGameRouter extends BaseRouter {
  private crashGameController: CrashGameController;

  constructor() {
    super();
    this.crashGameController = new CrashGameController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.crashGameController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(CreateExampleSchema, mapProperty.getBody),
      actionHandler(this.crashGameController.create, mapProperty.getBody)
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.crashGameController.getByName,
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
      // actionHandler(this.exampleController.update, [
      //   mapProperty.getNameFromParam,
      //   mapProperty.getBody,
      // ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.crashGameController.delete, mapProperty.getNameFromParam)
    );
  }
}
