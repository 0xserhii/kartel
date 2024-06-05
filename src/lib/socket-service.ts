import { IChatClientToServerEvents, IChatServerToClientEvents } from "@/types";
import { ICoinflipClientToServerEvents, ICoinflipServerToClientEvents } from "@/types/coinflip";
// import { ICrashClientToServerEvents, ICrashServerToClientEvents } from "@/types/crash";
import { Socket, io } from "socket.io-client";


const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const chatSocket: Socket<
    IChatServerToClientEvents,
    IChatClientToServerEvents
> = io(`${SERVER_URL}/chat`);

// const crashSocket: Socket<
//     ICrashServerToClientEvents,
//     ICrashClientToServerEvents
// > = io(`${SERVER_URL}/crash`);

// const coinflipSocket: Socket<
//     ICoinflipServerToClientEvents,
//     ICoinflipClientToServerEvents
// > = io(`${SERVER_URL}/coinflip`);

const leaderboardSocket: Socket<
    ICoinflipServerToClientEvents,
    ICoinflipClientToServerEvents
> = io(`${SERVER_URL}/leaderboard`);

const KartelSocket = {
    chat: chatSocket,
    // crash: crashSocket,
    // coinflip: coinflipSocket,
    leaderboard: leaderboardSocket
}

export default KartelSocket