import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";
import * as validations from "@/utils/validations";

import {
  CreateMinesGameSchema,
  MinesGameController,
  UpdateMinesGameSchema,
} from ".";

export default class MinesGameRouter extends BaseRouter {
  private minesGameController: MinesGameController;

  constructor() {
    super();

    this.minesGameController = new MinesGameController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.minesGameController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(CreateMinesGameSchema, mapProperty.getBody),
      actionHandler(this.minesGameController.create, mapProperty.getBody)
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.minesGameController.getByName,
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
      validateSchema(CreateMinesGameSchema, mapProperty.getBody),
      // actionHandler(
      //   this.minesGameController.getById,
      //   mapPropertyExample.getIdFromParamsWithMe
      // )
    );

    this.router.put(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(UpdateMinesGameSchema, mapProperty.getBody),
      actionHandler(this.minesGameController.update, [
        mapProperty.getNameFromParam,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.minesGameController.delete, mapProperty.getNameFromParam)
    );
  }
}
