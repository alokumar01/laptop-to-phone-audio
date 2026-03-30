import { publicEnv } from "@/lib/env";

export const SIGNALING_EVENTS = {
  join: "join",
  userJoined: "user-joined",
  signal: "signal",
} as const;

export type PeerRole = "sender" | "listener";
export type SignalType = "offer" | "answer" | "ice";
export type ConnectionState = "idle" | "connecting" | "connected" | "reconnecting" | "failed" | "disconnected";

export interface JoinPayload {
  room: string;
  role: PeerRole;
}

export interface UserJoinedEvent {
  id: string;
  room?: string;
  role?: PeerRole;
}

export interface SignalEvent<TPayload = RTCSessionDescriptionInit | RTCIceCandidateInit> {
  room: string;
  to?: string;
  from?: string;
  role?: PeerRole;
  type: SignalType;
  payload: TPayload;
}

const iceServers: RTCIceServer[] = [{ urls: publicEnv.stunUrl }];

if (publicEnv.turnUrl && publicEnv.turnUsername && publicEnv.turnCredential) {
  iceServers.push({
    urls: publicEnv.turnUrl,
    username: publicEnv.turnUsername,
    credential: publicEnv.turnCredential,
  });
}

export const RTC_CONFIGURATION: RTCConfiguration = {
  iceServers,
};

export const HAS_TURN_CONFIG =
  Boolean(publicEnv.turnUrl) && Boolean(publicEnv.turnUsername) && Boolean(publicEnv.turnCredential);
