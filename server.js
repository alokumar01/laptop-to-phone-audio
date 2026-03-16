/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("node:http");
const os = require("node:os");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const EVENTS = {
  join: "join",
  peers: "peers",
  peerJoined: "peer-joined",
  peerLeft: "peer-left",
  listenerReady: "listener-ready",
  requestOffer: "request-offer",
  offer: "offer",
  answer: "answer",
  ice: "ice",
};

const ROOM_ID_REGEX = /^[a-zA-Z0-9-]{8,80}$/;
const MAX_LISTENERS_PER_ROOM = 10;
const MAX_ROOM_AGE_MS = 1000 * 60 * 60 * 2;
const RATE_LIMITS = {
  join: { limit: 20, windowMs: 10_000 },
  requestOffer: { limit: 20, windowMs: 10_000 },
  offer: { limit: 40, windowMs: 10_000 },
  answer: { limit: 40, windowMs: 10_000 },
  ice: { limit: 300, windowMs: 10_000 },
};

const socketRateMap = new Map();
const roomSessionMap = new Map();

function getLanIPv4() {
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    if (!entries) continue;
    for (const entry of entries) {
      if (entry.family === "IPv4" && !entry.internal) {
        return entry.address;
      }
    }
  }
  return null;
}

function makeReceiverOrigin(req) {
  const hostHeader = req.headers.host || "";
  const hostOnly = hostHeader.split(":")[0] || "";
  const loopbackHosts = new Set(["localhost", "127.0.0.1", "::1"]);

  if (hostOnly && !loopbackHosts.has(hostOnly)) {
    return `http://${hostHeader}`;
  }

  const lanIp = getLanIPv4();
  if (lanIp) {
    return `http://${lanIp}:${port}`;
  }

  return `http://localhost:${port}`;
}

function isRoomIdValid(room) {
  return typeof room === "string" && ROOM_ID_REGEX.test(room);
}

function consumeSocketRate(socketId, action, limit, windowMs) {
  const now = Date.now();
  let actionMap = socketRateMap.get(socketId);
  if (!actionMap) {
    actionMap = new Map();
    socketRateMap.set(socketId, actionMap);
  }

  const bucket = actionMap.get(action) || { count: 0, resetAt: now + windowMs };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + windowMs;
  }

  bucket.count += 1;
  actionMap.set(action, bucket);
  return bucket.count <= limit;
}

function touchRoomSession(room, senderId) {
  const now = Date.now();
  const existing = roomSessionMap.get(room);
  if (!existing) {
    roomSessionMap.set(room, { senderId: senderId || null, createdAt: now, lastActiveAt: now });
    return;
  }
  existing.lastActiveAt = now;
  if (senderId) {
    existing.senderId = senderId;
  }
}

function cleanupRoomSession(io, room) {
  const sockets = io.sockets.adapter.rooms.get(room);
  if (!sockets || sockets.size === 0) {
    roomSessionMap.delete(room);
  }
}

async function peerExistsInRoom(io, room, peerId) {
  const sockets = await io.in(room).fetchSockets();
  return sockets.some((peerSocket) => peerSocket.id === peerId);
}

app
  .prepare()
  .then(() => {
    const httpServer = http.createServer((req, res) => {
      if (req.url && req.url.startsWith("/api/host-info")) {
        const payload = {
          origin: makeReceiverOrigin(req),
          lanIp: getLanIPv4(),
          port,
        };
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.setHeader("Cache-Control", "no-store");
        res.end(JSON.stringify(payload));
        return;
      }

      handle(req, res);
    });

    const io = new Server(httpServer, {
      path: "/socket.io",
      cors: {
        origin: true,
        credentials: true,
      },
    });

    setInterval(() => {
      const now = Date.now();
      for (const [room, session] of roomSessionMap.entries()) {
        const roomSockets = io.sockets.adapter.rooms.get(room);
        const roomEmpty = !roomSockets || roomSockets.size === 0;
        const roomExpired = now - session.createdAt > MAX_ROOM_AGE_MS;
        if (roomEmpty || roomExpired) {
          roomSessionMap.delete(room);
        }
      }
    }, 60_000).unref();

    io.on("connection", (socket) => {
      socket.on(EVENTS.join, async ({ room, role }, ack) => {
        const withinRate = consumeSocketRate(socket.id, EVENTS.join, RATE_LIMITS.join.limit, RATE_LIMITS.join.windowMs);
        if (!withinRate) {
          if (typeof ack === "function") {
            ack({ ok: false, error: "rate-limited" });
          }
          return;
        }

        if (!isRoomIdValid(room) || (role !== "sender" && role !== "listener")) {
          if (typeof ack === "function") {
            ack({ ok: false, error: "invalid-join-payload" });
          }
          return;
        }

        const existingSession = roomSessionMap.get(room);
        if (existingSession && Date.now() - existingSession.createdAt > MAX_ROOM_AGE_MS) {
          roomSessionMap.delete(room);
        }

        const sameRoom = socket.data.room === room && socket.data.role === role && socket.rooms.has(room);
        if (sameRoom) {
          const socketsInRoom = await io.in(room).fetchSockets();
          const peers = socketsInRoom
            .filter((peerSocket) => peerSocket.id !== socket.id)
            .map((peerSocket) => ({
              id: peerSocket.id,
              role: peerSocket.data.role || "listener",
            }));

          socket.emit(EVENTS.peers, peers);
          if (typeof ack === "function") {
            ack({ ok: true, peers });
          }
          return;
        }

        if (socket.data.room && socket.data.room !== room) {
          socket.leave(socket.data.room);
          cleanupRoomSession(io, socket.data.room);
        }

        const socketsInRoom = await io.in(room).fetchSockets();
        const senderPeer = socketsInRoom.find((peerSocket) => peerSocket.data.role === "sender");
        const listenerCount = socketsInRoom.filter((peerSocket) => peerSocket.data.role === "listener").length;

        if (role === "sender" && senderPeer && senderPeer.id !== socket.id) {
          if (typeof ack === "function") {
            ack({ ok: false, error: "sender-already-active" });
          }
          return;
        }

        if (role === "listener" && listenerCount >= MAX_LISTENERS_PER_ROOM) {
          if (typeof ack === "function") {
            ack({ ok: false, error: "room-full" });
          }
          return;
        }

        socket.data.room = room;
        socket.data.role = role;
        socket.join(room);

        touchRoomSession(room, role === "sender" ? socket.id : null);
        const updatedSocketsInRoom = await io.in(room).fetchSockets();
        const peers = updatedSocketsInRoom
          .filter((peerSocket) => peerSocket.id !== socket.id)
          .map((peerSocket) => ({
            id: peerSocket.id,
            role: peerSocket.data.role || "listener",
          }));

        socket.emit(EVENTS.peers, peers);
        socket.to(room).emit(EVENTS.peerJoined, { id: socket.id, role });
        if (role === "listener") {
          socket.to(room).emit(EVENTS.listenerReady, { id: socket.id });
        }
        if (typeof ack === "function") {
          ack({ ok: true, peers });
        }
      });

      socket.on(EVENTS.requestOffer, ({ room }) => {
        const withinRate = consumeSocketRate(
          socket.id,
          EVENTS.requestOffer,
          RATE_LIMITS.requestOffer.limit,
          RATE_LIMITS.requestOffer.windowMs
        );
        if (!withinRate) return;

        if (!room || socket.data.room !== room || socket.data.role !== "listener") return;
        touchRoomSession(room, null);
        socket.to(room).emit(EVENTS.listenerReady, { id: socket.id });
      });

      socket.on(EVENTS.offer, async ({ to, offer }) => {
        const room = socket.data.room;
        const withinRate = consumeSocketRate(socket.id, EVENTS.offer, RATE_LIMITS.offer.limit, RATE_LIMITS.offer.windowMs);
        if (!withinRate) return;
        if (!room || !to || !offer) return;
        const peerExists = await peerExistsInRoom(io, room, to);
        if (!peerExists) return;
        touchRoomSession(room, socket.data.role === "sender" ? socket.id : null);
        io.to(to).emit(EVENTS.offer, { from: socket.id, offer });
      });

      socket.on(EVENTS.answer, async ({ to, answer }) => {
        const room = socket.data.room;
        const withinRate = consumeSocketRate(
          socket.id,
          EVENTS.answer,
          RATE_LIMITS.answer.limit,
          RATE_LIMITS.answer.windowMs
        );
        if (!withinRate) return;
        if (!room || !to || !answer) return;
        const peerExists = await peerExistsInRoom(io, room, to);
        if (!peerExists) return;
        touchRoomSession(room, null);
        io.to(to).emit(EVENTS.answer, { from: socket.id, answer });
      });

      socket.on(EVENTS.ice, async ({ to, candidate }) => {
        const room = socket.data.room;
        const withinRate = consumeSocketRate(socket.id, EVENTS.ice, RATE_LIMITS.ice.limit, RATE_LIMITS.ice.windowMs);
        if (!withinRate) return;
        if (!room || !to || !candidate) return;
        const peerExists = await peerExistsInRoom(io, room, to);
        if (!peerExists) return;
        touchRoomSession(room, null);
        io.to(to).emit(EVENTS.ice, { from: socket.id, candidate });
      });

      socket.on("disconnect", () => {
        socketRateMap.delete(socket.id);
        if (socket.data.room) {
          if (socket.data.role === "sender") {
            const session = roomSessionMap.get(socket.data.room);
            if (session && session.senderId === socket.id) {
              session.senderId = null;
              session.lastActiveAt = Date.now();
            }
          }
          socket.to(socket.data.room).emit(EVENTS.peerLeft, { id: socket.id });
          cleanupRoomSession(io, socket.data.room);
        }
      });
    });

    httpServer.listen(port, hostname, () => {
      console.log(`[signal] server ready at http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start Next signaling server:", err);
    process.exit(1);
  });
