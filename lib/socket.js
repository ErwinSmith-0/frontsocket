import { io } from "socket.io-client";
// https://chatsocket.thesuitchstaging.com:3050
export const socket = io(`http://localhost:3050`);
