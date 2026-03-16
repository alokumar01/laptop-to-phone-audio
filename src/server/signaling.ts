export const SIGNALING_EVENTS = {
  join: "join",
  peers: "peers",
  peerJoined: "peer-joined",
  peerLeft: "peer-left",
  listenerReady: "listener-ready",
  requestOffer: "request-offer",
  offer: "offer",
  answer: "answer",
  ice: "ice",
} as const;

export type PeerRole = "sender" | "listener";

export interface JoinPayload {
  room: string;
  role: PeerRole;
}

export interface PeerInfo {
  id: string;
  role: PeerRole;
}

export interface OfferPayload {
  room: string;
  to: string;
  offer: RTCSessionDescriptionInit;
}

export interface AnswerPayload {
  room: string;
  to: string;
  answer: RTCSessionDescriptionInit;
}

export interface IcePayload {
  room: string;
  to: string;
  candidate: RTCIceCandidateInit;
}

export interface OfferEvent {
  from: string;
  offer: RTCSessionDescriptionInit;
}

export interface AnswerEvent {
  from: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceEvent {
  from: string;
  candidate: RTCIceCandidateInit;
}

export const RTC_CONFIGURATION: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
