import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";
import * as validations from "@/utils/validations";

import {
  CreateRevenueLogSchema,
  RevenueLogController,
  UpdateRevenueLogSchema,
} from ".";

export default class RevenueLogRouter extends BaseRouter {
  private revenueLogController: RevenueLogController;

  constructor() {
    super();

    this.revenueLogController = new RevenueLogController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.revenueLogController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(CreateRevenueLogSchema, mapProperty.getBody),
      actionHandler(this.revenueLogController.create, mapProperty.getBody)
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.revenueLogController.getByName,
        mapProperty.getNameFromParam
      )
    );

    this.router.get(
      "/:id",
      checkPermissions(),
      // validateSchema(
      //   validations.byId,
      //   mapProperty.getIdFromParamsWithMe
      // ),
      validateSchema(CreateRevenueLogSchema, mapProperty.getBody),
      // actionHandler(
      //   this.revenueLogController.getById,
      //   mapProperty.getIdFromParamsWithMe
      // )
    );

    this.router.put(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(UpdateRevenueLogSchema, mapProperty.getBody),
      actionHandler(this.revenueLogController.update, [
        mapProperty.getNameFromParam,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.revenueLogController.delete, mapProperty.getNameFromParam)
    );
  }
}
