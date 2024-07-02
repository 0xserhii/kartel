import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";

import { WalletTransactionController } from ".";

export default class WalletTransactionRouter extends BaseRouter {
  private walletTransactionController: WalletTransactionController;

  constructor() {
    super();

    this.walletTransactionController = new WalletTransactionController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.walletTransactionController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(CreatePaymentSchema, mapProperty.getBody),
      actionHandler(
        this.walletTransactionController.create,
        mapProperty.getBody
      )
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.walletTransactionController.getByName,
        mapProperty.getNameFromParam
      )
    );

    this.router.get(
      "/:id",
      checkPermissions()
      // validateSchema(
      //   validations.byId,
      //   mapProperty.getIdFromParamsWithMe
      // ),
      // validateSchema(CreatePaymentSchema, mapProperty.getBody),
      // actionHandler(
      //   this.exampleController.getById,
      //   mapPropertyExample.getIdFromParamsWithMe
      // )
    );

    this.router.put(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(UpdatePaymentSchema, mapProperty.getBody),
      actionHandler(this.walletTransactionController.update, [
        mapProperty.getNameFromParam,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(
        this.walletTransactionController.delete,
        mapProperty.getNameFromParam
      )
    );
  }
}
