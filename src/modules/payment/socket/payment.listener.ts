import { Namespace, Server, Socket, Event as SocketEvent } from "socket.io";

import { ESOCKET_NAMESPACE } from "@/constant/enum";
import PaymentSocketHandler from "./payment.socket-controller";
import { EPaymentEvents } from "../payment.constant";
import { TSocketDepositParam, TSocketWithDrawParam } from "../payment.types";


class PaymentSocketListener {
  private socketServer: Namespace;
  private logPrefix = "[Payment Socket:::]";

  constructor(socketServer: Server) {
    // Initialize service

    this.socketServer = socketServer.of(ESOCKET_NAMESPACE.payment);
    this.subscribeListener();
  }

  private subscribeListener(): void {
    this.socketServer.on("connection", (socket: Socket) => {
      const paymentSocketHandler = new PaymentSocketHandler(
        this.socketServer,
        socket
      )

      // Auth handler
      socket.on(EPaymentEvents.login, async (token: string) => {
        await paymentSocketHandler.authHandler(token)
      })
      // User deposit
      socket.on(EPaymentEvents.deposit, async (depositParam: TSocketDepositParam) => {
        await paymentSocketHandler.depositHandler(depositParam)
      })
      // User withdraw
      socket.on(EPaymentEvents.withdraw, async (withdrawParam: TSocketWithDrawParam) => {
        await paymentSocketHandler.withdrawHandler(withdrawParam)
      })

      // Check for users ban status
      socket.use((packet: SocketEvent, next: (err?: any) => void) =>
        paymentSocketHandler.banStatusCheckMiddleware(packet, next)
      );

    });
  }
}

export default PaymentSocketListener;
