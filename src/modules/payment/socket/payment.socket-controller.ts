import jwt, { JwtPayload } from "jsonwebtoken";
import { Namespace, Socket, Event as SocketEvent } from "socket.io";

import { ADMIN_WALLET_ADDRESS, TOKEN_SECRET } from "@/config";
import { IUserModel } from "@/modules/user/user.interface";
import UserService from "@/modules/user/user.service";
import logger from "@/utils/logger";
import { TSocketDepositParam, TSocketWithDrawParam } from "../payment.types";
import { EPaymentEvents } from "../payment.constant";
import { PaymentController } from "../payment.controller";
import AESWrapper from "@/utils/encryption/aes-wrapper";


class PaymentSocketHandler {
  private socket: Socket;
  private socketNameSpace: Namespace;
  private loggedIn = false;
  private user: IUserModel | null = null;
  private logoPrefix: string = "[Payment Socket Handler]::: ";
  private paymentController: PaymentController;
  private aesKey: Buffer;

  private userService: UserService;

  constructor(socketNameSpace: Namespace, socket: Socket) {
    this.userService = new UserService();
    this.paymentController = new PaymentController()

    this.socket = socket;
    this.socketNameSpace = socketNameSpace;
  }

  public authHandler = async (token: string) => {
    if (!token) {
      this.loggedIn = false;
      this.user = null;
      return this.socket.emit(
        "error",
        "No authentication token provided, authorization declined"
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, TOKEN_SECRET) as JwtPayload;
      this.user = await this.userService.getItemById(decoded.userId);

      if (this.user) {
        if (parseInt(this.user.banExpires) > new Date().getTime()) {
          this.loggedIn = false;
          this.user = null;
          return this.socket.emit("user banned");
        } else {
          this.loggedIn = true;
          this.socket.join(String(this.user._id));
          logger.info(this.logoPrefix + "User connected: " + this.user._id);

          await this.getAdminWalletInfo()

          this.socketNameSpace.to(String(this.user._id)).emit(
            "notify-success",
            "Authentication success"
          )
        }
      }
    } catch (error) {
      this.loggedIn = false;
      logger.error(this.logoPrefix + "Auth error occured" + error);
      this.user = null;
      return this.socket.emit(
        "notify-error",
        "Authentication token is not valid"
      );
    }
  };

  public depositHandler = async (depositParam: TSocketDepositParam) => {
    try {
      if (!this.loggedIn || !this.user?._id) {
        return this.socket.emit("notify-error", `You are not logged in!`);
      }
      const resDeposit = await this.paymentController.userBalanceDeposit(depositParam, { userId: this.user._id, role: this.user.role, status: this.user.status })

      if (typeof resDeposit === 'object' && 'status' in resDeposit && resDeposit.status !== "success") {
        return this.socketNameSpace.to(String(this.user._id)).emit(
          EPaymentEvents.paymentFailed,
          `Deposit Failed`
        );
      }

      if (typeof resDeposit !== 'object') {
        return this.socketNameSpace.to(String(this.user._id)).emit(
          EPaymentEvents.paymentFailed,
          `Deposit Failed`
        );
      }
      return this.socketNameSpace.to(String(this.user._id)).emit(
        EPaymentEvents.updateBalance,
        {
          walletValue: resDeposit.data?.[depositParam.currency],
          denom: depositParam.currency
        }
      )
    } catch (error) {
      logger.error(this.logoPrefix + "Deposit failed" + error);
      return this.socket.emit(
        EPaymentEvents.paymentFailed,
        `Deposit Failed`
      );
    }
  };

  public withdrawHandler = async (withdrawParam: TSocketWithDrawParam) => {
    try {
      if (!this.loggedIn || !this.user?._id) {
        return this.socket.emit("notify-error", `You are not logged in!`);
      }
      const resWithdraw = await this.paymentController.userBalanceWithdraw(withdrawParam, { userId: this.user._id, role: this.user.role, status: this.user.status })

      if (typeof resWithdraw === 'object' && 'status' in resWithdraw && resWithdraw.status !== "success") {
        return this.socketNameSpace.to(String(this.user._id)).emit(
          EPaymentEvents.paymentFailed,
          `Withdraw Failed`
        );
      }

      if (typeof resWithdraw !== 'object') {
        return this.socketNameSpace.to(String(this.user._id)).emit(
          EPaymentEvents.paymentFailed,
          `Withdraw Failed`
        );
      }
      return this.socketNameSpace.to(String(this.user._id)).emit(
        EPaymentEvents.updateBalance,
        {
          walletValue: resWithdraw.data?.[withdrawParam.currency],
          denom: withdrawParam.currency
        }
      )
    } catch (error) {
      logger.error(this.logoPrefix + "Withdraw failed" + error);
      return this.socket.emit(
        EPaymentEvents.paymentFailed,
        `Withdraw Failed`
      );
    }
  };

  public getAdminWalletInfo = async () => {
    try {
      if (!this.loggedIn || !this.user?._id) {
        return this.socket.emit("notify-error", `You are not logged in!`);
      }
      const address = ADMIN_WALLET_ADDRESS ?? "";
      this.aesKey = AESWrapper.generateKey();
      const encryptedAddress = AESWrapper.createAesMessage(this.aesKey, address);

      const adminRes = {
        address: this.aesKey.toString("base64"),
        key: encryptedAddress
      }
      return this.socketNameSpace.to(String(this.user._id)).emit(
        EPaymentEvents.setAdminWallet,
        adminRes
      )
    } catch (error) {
      logger.error(this.logoPrefix + "Send message error occured" + error);
      return this.socket.emit(
        "notify-error",
        `An error is occured on withdarw!`
      );
    }
  };


  public banStatusCheckMiddleware = async (
    packet: SocketEvent,
    next: (err?: any) => void
  ) => {
    console.log({ packet })
    if (packet[0] === EPaymentEvents.login) {
      return next()
    }
    if (this.loggedIn && this.user) {
      try {
        // Check if user is banned
        if (this.user && parseInt(this.user.banExpires) > new Date().getTime()) {
          return this.socket.emit("user banned");
        } else {
          return next();
        }
      } catch (error) {
        return this.socket.emit("user banned");
      }
    } else {
      return this.socket.emit("user banned");
    }
  };

  public disconnectHandler = async () => {
    this.user = null
  };

}

export default PaymentSocketHandler;
