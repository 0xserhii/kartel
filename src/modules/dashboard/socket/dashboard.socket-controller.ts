import { Namespace, Socket } from "socket.io";
import { IUserModel } from "@/modules/user/user.interface";
import UserService from "@/modules/user/user.service";
import { RevenueLogService } from "@/modules/revenue-log";

class DashboardSocketHandler {
  private socket: Socket;
  private socketNameSpace: Namespace;
  private loggedIn = false;
  private user: IUserModel | null = null;
  private logoPrefix: string = "[Chat Socket Handler]::: ";
  private userService: UserService;
  private reveneuLogService: RevenueLogService;

  constructor(socketNameSpace: Namespace, socket: Socket) {
    this.socket = socket;
    this.socketNameSpace = socketNameSpace;
    this.userService = new UserService();
    this.reveneuLogService = new RevenueLogService();
  }

  public disconnectHandler = async () => { };
}

export default DashboardSocketHandler;