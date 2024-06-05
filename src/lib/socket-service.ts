import { IChatClientToServerEvents, IChatServerToClientEvents } from "@/types";
import { Socket, io } from "socket.io-client";


const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const chatSocket: Socket<
    IChatServerToClientEvents,
    IChatClientToServerEvents
> = io(`${SERVER_URL}/chat`);

const KartelSocket = {
    chat: chatSocket
}

export default KartelSocket