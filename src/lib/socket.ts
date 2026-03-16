"use client";

import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;

  socket = io({
    path: "/socket.io",
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 500,
  });

  return socket;
}

export function closeSocket() {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}
