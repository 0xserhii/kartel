import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";
// import * as validations from "@/utils/validations";

import {
  AutoCrashBetController,
} from "./";

export default class AutoCrashBetRouter extends BaseRouter {
  private autoCrashBetController: AutoCrashBetController;

  constructor() {
    super();

    this.autoCrashBetController = new AutoCrashBetController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.autoCrashBetController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(CreateExampleSchema, mapProperty.getBody),
      actionHandler(this.autoCrashBetController.create, mapProperty.getBody)
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.autoCrashBetController.getByName,
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
      //   this.autoCrashBetController.getById,
      //   mapPropertyExample.getIdFromParamsWithMe
      // )
    );

    this.router.put(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(UpdateExampleSchema, mapProperty.getBody),
      actionHandler(this.autoCrashBetController.update, [
        mapProperty.getNameFromParam,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.autoCrashBetController.delete, mapProperty.getNameFromParam)
    );
  }
}
