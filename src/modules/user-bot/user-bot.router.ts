import actionHandler from "@/middleware/action-handler";
import addDirForUpload from "@/middleware/add-dirForUpload";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { BaseRouter } from "@/utils/base";
import { fileHelpers } from "@/utils/helpers";
import * as mapProperty from "@/utils/interfaces";
import * as validations from "@/utils/validations";

import { ROLE } from "./user-bot.constant";
import UserController from "./user-bot.controller";
import * as mapPropertyUser from "./user-bot.interface";
import * as validateUser from "./user-bot.validate";
import UserBotController from "./user-bot.controller";

export default class UserBotRouter extends BaseRouter {
  private userBotController: UserBotController;

  constructor() {
    super();

    this.userBotController = new UserBotController();

    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      validateSchema(validations.getListValidation, mapProperty.getQuery),
      actionHandler(this.userBotController.getUsers, mapProperty.getQuery)
    );

    this.router.get(
      "/permissions",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.userBotController.getPermissions)
    );

    this.router.get(
      "/:id",
      checkPermissions(),
      // validateSchema(validateUser.Id, mapPropertyUser.getId),
      actionHandler(this.userBotController.getUserById, [
        // mapPropertyUser.getId,
        mapProperty.getUserInfo,
        mapProperty.getUTCFromHeader,
      ])
    );

    this.router.put(
      "/admin/:id",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(validations.byId, mapPropertyUser.getId),
      addDirForUpload("avatars"),
      fileHelpers.single("avatar"),
      // validateSchema(validateUser.additionAdmin, mapPropertyUser.user),
      actionHandler(this.userBotController.editUserForAdmin, [
        // mapPropertyUser.getId,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:id",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(validateUser.Id, mapPropertyUser.getId),
      actionHandler(this.userBotController.deleteUser, [
        // mapPropertyUser.getId,
        mapProperty.getUserInfo,
      ])
    );

    this.router.put(
      "/me",
      checkPermissions(),
      // validateSchema(validateUser.addition, mapPropertyUser.user),
      actionHandler(this.userBotController.editUser, [
        // mapPropertyUser.user,
        mapProperty.getUserInfo,
      ])
    );

    this.router.get(
      "/me",
      checkPermissions(),
      actionHandler(this.userBotController.getUserByToken)
    );

    this.router.get(
      "/permissions",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.userBotController.getPermissions)
    );
  }
}
