import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";

import {
  LeaderboardController,
} from ".";

export default class LeaderboardRouter extends BaseRouter {
  private leaderboardController: LeaderboardController;

  constructor() {
    super();

    this.leaderboardController = new LeaderboardController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.leaderboardController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(CreateExampleSchema, mapProperty.getBody),
      actionHandler(this.leaderboardController.create, mapProperty.getBody)
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.leaderboardController.getByName,
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
      actionHandler(
        this.leaderboardController.getById,
        // mapPropertyExample.getIdFromParamsWithMe
      )
    );

    this.router.put(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(UpdateExampleSchema, mapProperty.getBody),
      actionHandler(this.leaderboardController.update, [
        mapProperty.getNameFromParam,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.leaderboardController.delete, mapProperty.getNameFromParam)
    );
  }
}
