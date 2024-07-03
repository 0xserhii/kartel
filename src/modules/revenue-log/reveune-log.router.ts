import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";

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
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.revenueLogController.getAll)
    );
  }
}
