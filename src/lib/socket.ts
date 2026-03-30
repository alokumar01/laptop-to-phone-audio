"use client";

import { io, type Socket } from "socket.io-client";
import { publicEnv } from "@/lib/env";

let socket: Socket | null = null;

export function getSocket() {
  if (socket) return socket;

  socket = io(publicEnv.signalingUrl, {
    transports: ["websocket"],
    path: "/socket.io",
    secure: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 4000,
    timeout: 10_000,
  });

  socket.on("connect", () => {
    console.info("[socket] connected", {
      id: socket?.id,
      url: publicEnv.signalingUrl,
    });
  });

  socket.on("connect_error", (error) => {
    console.error("[socket] connect_error", {
      message: error.message,
      url: publicEnv.signalingUrl,
    });
  });

  socket.on("disconnect", (reason) => {
    console.warn("[socket] disconnected", {
      reason,
      url: publicEnv.signalingUrl,
    });
  });

  return socket;
}

export async function waitForSocketConnection(target: Socket, timeoutMs = 10_000) {
  if (target.connected) return;

  target.connect();

  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error("Signaling connection timed out."));
    }, timeoutMs);

    const handleConnect = () => {
      cleanup();
      resolve();
    };

    const handleError = (err: Error) => {
      cleanup();
      reject(err);
    };

    const cleanup = () => {
      window.clearTimeout(timeout);
      target.off("connect", handleConnect);
      target.off("connect_error", handleError);
    };

    target.on("connect", handleConnect);
    target.on("connect_error", handleError);
  });
}

export function closeSocket() {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}
