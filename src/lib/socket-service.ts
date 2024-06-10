import { IChatClientToServerEvents, IChatServerToClientEvents } from "@/types";
import { ICoinflipClientToServerEvents, ICoinflipServerToClientEvents } from "@/types/coinflip";
import { ILeaderboardClientToServerEvents, ILeaderboardServerToClientEvents } from "@/types/leader";
// import { ICrashClientToServerEvents, ICrashServerToClientEvents } from "@/types/crash";
import { Socket, io } from "socket.io-client";
import customParser from 'socket.io-msgpack-parser'


const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const createSocket = <ServerEvents, ClientEvents>(namespace: string): Socket<any, any> => {
    return io(`${SERVER_URL}/${namespace}`, { parser: customParser });
}

const chatSocket = createSocket<IChatServerToClientEvents, IChatClientToServerEvents>('chat');
const coinflipSocket = createSocket<ICoinflipServerToClientEvents, ICoinflipClientToServerEvents>('coinflip');
const leaderboardSocket = createSocket<ICoinflipServerToClientEvents, ICoinflipClientToServerEvents>('leaderboard');

const KartelSocket = {
    chat: chatSocket,
    coinflip: coinflipSocket,
    leaderboard: leaderboardSocket
};

export default KartelSocket