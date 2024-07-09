import { IChatClientToServerEvents, IChatServerToClientEvents } from "@/types";
import {
  ICoinflipClientToServerEvents,
  ICoinflipServerToClientEvents,
} from "@/types/coinflip";
import {
  ILeaderboardClientToServerEvents,
  ILeaderboardServerToClientEvents,
} from "@/types/leader";
import {
  IMinesClientToServerEvents,
  IMinesServerToClientEvents,
} from "@/types/mines";
import {
  IUserClientToServerEvents,
  IUserServerToClientEvents,
} from "@/types/user";
import { Socket, io } from "socket.io-client";
import customParser from "socket.io-msgpack-parser";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const createSocket = <ServerEvents, ClientEvents>(
  namespace: string
): Socket<any, any> => {
  return io(`${SERVER_URL}/${namespace}`, { parser: customParser });
};

const chatSocket = createSocket<
  IChatServerToClientEvents,
  IChatClientToServerEvents
>("813474ade739d5d");

const coinflipSocket = createSocket<
  ICoinflipServerToClientEvents,
  ICoinflipClientToServerEvents
>("coinflip");

const leaderboardSocket = createSocket<
  ILeaderboardServerToClientEvents,
  ILeaderboardClientToServerEvents
>("aaf366284dd1");

const minesSocket = createSocket<
  IMinesServerToClientEvents,
  IMinesClientToServerEvents
>("mines");

const crashSocket = createSocket<
  IUserServerToClientEvents,
  IUserClientToServerEvents
>("crash");

const paymentSocket = createSocket<
  IUserServerToClientEvents,
  IUserClientToServerEvents
>("e3b86d17bc14e9");

const dashboardSocket = createSocket<
  IUserServerToClientEvents,
  IUserClientToServerEvents
>("d133087e2w21");

const KartelSocket = {
  chat: chatSocket,
  coinflip: coinflipSocket,
  leaderboard: leaderboardSocket,
  crash: crashSocket,
  payment: paymentSocket,
  mines: minesSocket,
  dashboard: dashboardSocket,
};

export default KartelSocket;
