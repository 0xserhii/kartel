import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";

import { CoinflipGameController } from ".";

export default class CoinflipGameRouter extends BaseRouter {
  private coinflipGameController: CoinflipGameController;

  constructor() {
    super();

    this.coinflipGameController = new CoinflipGameController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.coinflipGameController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(CreateExampleSchema, mapProperty.getBody),
      actionHandler(this.coinflipGameController.create, mapProperty.getBody)
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.coinflipGameController.getByName,
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
        this.coinflipGameController.getById
        // mapPropertyExample.getIdFromParamsWithMe
      )
    );

    this.router.put(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(UpdateExampleSchema, mapProperty.getBody),
      actionHandler(this.coinflipGameController.update, [
        mapProperty.getNameFromParam,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(
        this.coinflipGameController.delete,
        mapProperty.getNameFromParam
      )
    );
  }
}
