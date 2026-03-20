"use client";

import { io, type Socket } from "socket.io-client";
import { publicEnv } from "@/lib/env";

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;

  socket = io(publicEnv.signalingUrl, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 500,
    timeout: 10_000,
  });

  return socket;
}

export function closeSocket() {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}
