import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import validateSchema from "@/middleware/validate-schema";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";
import * as mapProperty from "@/utils/interfaces";
import * as validations from "@/utils/validations";

import {
  PaymentController,
} from ".";

export default class PaymentRouter extends BaseRouter {
  private paymentController: PaymentController;

  constructor() {
    super();

    this.paymentController = new PaymentController();
    this.routes();
  }

  public routes(): void {
    this.router.get(
      "/",
      checkPermissions(),
      actionHandler(this.paymentController.getAll)
    );

    this.router.post(
      "/",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      // validateSchema(CreatePaymentSchema, mapProperty.getBody),
      actionHandler(this.paymentController.create, mapProperty.getBody)
    );

    this.router.get(
      "/name/:name",
      checkPermissions(),
      actionHandler(
        this.paymentController.getByName,
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
      actionHandler(this.paymentController.update, [
        mapProperty.getNameFromParam,
        mapProperty.getBody,
      ])
    );

    this.router.delete(
      "/:name",
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.paymentController.delete, mapProperty.getNameFromParam)
    );
  }
}
