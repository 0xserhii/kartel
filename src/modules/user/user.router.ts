import actionHandler from "@/middleware/action-handler";
import addDirForUpload from "@/middleware/add-dirForUpload";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { BaseRouter } from "@/utils/base";
import { fileHelpers } from "@/utils/helpers";
import * as mapProperty from "@/utils/interfaces";
import * as validations from "@/utils/validations";

import { ROLE } from "./user.constant";
import UserController from "./user.controller";
import * as mapPropertyUser from "./user.interface";
import * as validateUser from "./user.validate";

export default class UserRouter extends BaseRouter {
  private userController: UserController;

  constructor() {
    super();

    this.userController = new UserController();

    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(validations.getListValidation, mapProperty.getQuery),
      actionHandler(this.userController.getUsers, mapProperty.getQuery)
    );

    this.router.get(
      "/permissions",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.userController.getPermissions)
    );

    this.router.get(
      "/user/:id",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(validateUser.Id, mapPropertyUser.getId),
      actionHandler(this.userController.getUserById, [
        mapPropertyUser.getId,
        mapProperty.getUserInfo,
        mapProperty.getUTCFromHeader,
      ])
    );

    this.router.get(
      "/balance",
      checkPermissions(),
      actionHandler(this.userController.getUserBalance, [
        mapProperty.getUserInfo,
      ])
    );

    // this.router.post(
    //   "/withdraw",
    //   checkPermissions(),
    //   validateSchema(validateUser.withDraw, mapProperty.getBody),
    //   actionHandler(this.userController.userBalanceWithdraw, [
    //     mapProperty.getBody,
    //     mapProperty.getUserInfo,
    //   ])
    // );

    // this.router.post(
    //   "/deposit",
    //   checkPermissions(),
    //   actionHandler(this.userController.userBalanceDeposit, [
    //     mapProperty.getUserInfo,
    //   ])
    // );

  }
}
