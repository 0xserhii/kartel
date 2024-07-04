import actionHandler from "@/middleware/action-handler";
import checkPermissions from "@/middleware/check-permissions";
import { ROLE } from "@/modules/user/user.constant";
import { BaseRouter } from "@/utils/base";

// import * as mapProperty from "@/utils/interfaces";
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
      checkPermissions({ roles: [ROLE.ADMIN] }),
      actionHandler(this.walletTransactionController.getAll)
    );

    this.router.get("/:id", checkPermissions({ roles: [ROLE.ADMIN] }));
  }
}
