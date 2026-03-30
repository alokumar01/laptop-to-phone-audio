"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { QRCodeCard } from "@/components/QRCodeCard";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { publicEnv } from "@/lib/env";
import { closeSocket, getSocket, waitForSocketConnection } from "@/lib/socket";
import {
  RTC_CONFIGURATION,
  SIGNALING_EVENTS,
  type ConnectionState,
  type PeerRole,
  type SignalEvent,
  type UserJoinedEvent,
} from "@/lib/signaling";
import { captureDisplayAudio, forceLowLatencyOpus } from "@/lib/webrtc";

export const dynamic = "force-dynamic";

const SIGNALING_LABELS: Record<ConnectionState, string> = {
  idle: "Idle",
  connecting: "Connecting...",
  connected: "Connected",
  reconnecting: "Reconnecting...",
  failed: "Connection failed",
  disconnected: "Disconnected",
};

export default function SharePage() {
  const signalingHost = useMemo(() => new URL(publicEnv.signalingUrl).host, []);
  const [roomId, setRoomId] = useState("");
  const [status, setStatus] = useState("Connecting to signaling server...");
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [activeListeners, setActiveListeners] = useState<string[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [signalingState, setSignalingState] = useState<ConnectionState>("connecting");
  const [connectionError, setConnectionError] = useState("");
  const [reconnectCount, setReconnectCount] = useState(0);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  const streamRef = useRef<MediaStream | null>(null);
  const roomRef = useRef("");
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingRemoteCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const socket = useMemo(() => getSocket(), []);
  const pairUrl = useMemo(() => `${publicEnv.baseUrl}/listen?room=${roomId}`, [roomId]);

  useEffect(() => {
    // The sender room ID must be generated only on the client to avoid SSR/client mismatches.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoomId(uuidv4());
  }, []);

  const addListener = useCallback((peerId: string) => {
    if (!peerId) return;
    setActiveListeners((prev) => (prev.includes(peerId) ? prev : [...prev, peerId]));
  }, []);

  const removeListener = useCallback((peerId: string) => {
    setActiveListeners((prev) => prev.filter((id) => id !== peerId));
    pendingRemoteCandidatesRef.current.delete(peerId);
  }, []);

  const joinRoom = useCallback(() => {
    if (!roomId) return;
    roomRef.current = roomId;
    socket.emit(SIGNALING_EVENTS.join, {
      room: roomId,
      role: "sender" satisfies PeerRole,
    });
    setHasJoinedRoom(true);
  }, [roomId, socket]);

  const closePeer = useCallback(
    (peerId: string) => {
      const pc = peerConnectionsRef.current.get(peerId);
      if (!pc) return;
      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.onconnectionstatechange = null;
      pc.close();
      peerConnectionsRef.current.delete(peerId);
      removeListener(peerId);
    },
    [removeListener]
  );

  const stopBroadcast = useCallback(() => {
    for (const peerId of peerConnectionsRef.current.keys()) {
      closePeer(peerId);
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }

    setIsBroadcasting(false);
    setStatus(
      signalingState === "connected"
        ? "Broadcast stopped. Signaling is still connected."
        : "Broadcast stopped. Reconnect signaling before broadcasting again."
    );
  }, [closePeer, signalingState]);

  const tuneSender = useCallback(async (sender: RTCRtpSender) => {
    if (!sender.getParameters || !sender.setParameters) return;
    const params = sender.getParameters();
    if (!params.encodings || !params.encodings.length) {
      params.encodings = [{}];
    }
    params.encodings[0].maxBitrate = 128000;
    try {
      await sender.setParameters(params);
    } catch {
      // Browsers may reject dynamic sender tuning depending on capture source.
    }
  }, []);

  const createOfferForPeer = useCallback(
    async (peerId: string) => {
      if (!streamRef.current || !roomRef.current) return;

      let pc = peerConnectionsRef.current.get(peerId);
      if (!pc) {
        pc = new RTCPeerConnection(RTC_CONFIGURATION);
        peerConnectionsRef.current.set(peerId, pc);
        const currentPc = pc;

        for (const track of streamRef.current.getAudioTracks()) {
          const sender = currentPc.addTrack(track, streamRef.current);
          await tuneSender(sender);
        }

        currentPc.onicecandidate = (event) => {
          if (!event.candidate) return;
          socket.emit(SIGNALING_EVENTS.signal, {
            room: roomRef.current,
            to: peerId,
            role: "sender",
            type: "ice",
            payload: event.candidate.toJSON(),
          } satisfies SignalEvent<RTCIceCandidateInit>);
        };

        currentPc.onconnectionstatechange = () => {
          const state = currentPc.connectionState;
          if (state === "connected") {
            addListener(peerId);
          }
          if (state === "failed" || state === "disconnected" || state === "closed") {
            closePeer(peerId);
          }
        };
      }

      if (!pc) return;

      const offer = await pc.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false });
      offer.sdp = forceLowLatencyOpus(offer.sdp ?? "");
      await pc.setLocalDescription(offer);
      if (!pc.localDescription) {
        throw new Error("Sender offer could not be created.");
      }

      socket.emit(SIGNALING_EVENTS.signal, {
        room: roomRef.current,
        to: peerId,
        role: "sender",
        type: "offer",
        payload: pc.localDescription,
      } satisfies SignalEvent<RTCSessionDescriptionInit>);
    },
    [addListener, closePeer, socket, tuneSender]
  );

  const ensureSignalingReady = useCallback(async () => {
    setSignalingState((prev) => (prev === "reconnecting" ? prev : "connecting"));
    setConnectionError("");
    await waitForSocketConnection(socket);
    setSignalingState("connected");
    joinRoom();
  }, [joinRoom, socket]);

  const handleRetryConnection = useCallback(() => {
    setConnectionError("");
    setSignalingState("connecting");
    setStatus("Connecting to signaling server...");
    socket.connect();
  }, [socket]);

  useEffect(() => {
    const handleConnect = () => {
      setReconnectCount(0);
      setSignalingState("connected");
      setConnectionError("");
      joinRoom();
      setStatus(
        isBroadcasting
          ? "Broadcasting. Keep this tab active for best stability."
          : "Connected to signaling. Start broadcast when ready."
      );
    };

    const handleConnectError = (err: Error) => {
      setSignalingState("failed");
      setConnectionError(err.message || "Unable to reach signaling server.");
      setStatus("Connection failed. Check the signaling server and retry.");
    };

    const handleDisconnect = (reason: string) => {
      setHasJoinedRoom(false);
      setSignalingState(reason === "io client disconnect" ? "idle" : "disconnected");
      setStatus("Signaling disconnected. Waiting for reconnect or manual retry.");
    };

    const handleReconnectAttempt = (attempt: number) => {
      setReconnectCount(attempt);
      setSignalingState("reconnecting");
      setStatus(`Reconnecting to signaling server... attempt ${attempt}`);
    };

    const handleUserJoined = (peer: UserJoinedEvent) => {
      if (!peer.id || peer.id === socket.id || peer.role === "sender") return;
      addListener(peer.id);
      if (streamRef.current) {
        createOfferForPeer(peer.id).catch((err) => {
          setErrorText(String((err as Error)?.message || err));
          setErrorOpen(true);
        });
      }
    };

    const handleSignal = (event: SignalEvent) => {
      const peerId = event.from;
      if (!peerId || !event.payload) return;

      if (event.type === "answer") {
        const pc = peerConnectionsRef.current.get(peerId);
        if (!pc) return;

        pc.setRemoteDescription(event.payload as RTCSessionDescriptionInit)
          .then(async () => {
            const pending = pendingRemoteCandidatesRef.current.get(peerId) ?? [];
            for (const candidate of pending) {
              await pc.addIceCandidate(candidate);
            }
            pendingRemoteCandidatesRef.current.set(peerId, []);
          })
          .catch((err) => {
            setErrorText(String((err as Error)?.message || err));
            setErrorOpen(true);
          });
      }

      if (event.type === "ice") {
        const pc = peerConnectionsRef.current.get(peerId);
        if (!pc) return;

        const candidate = event.payload as RTCIceCandidateInit;
        if (pc.remoteDescription) {
          pc.addIceCandidate(candidate).catch((err) => {
            setErrorText(String((err as Error)?.message || err));
            setErrorOpen(true);
          });
          return;
        }

        const pending = pendingRemoteCandidatesRef.current.get(peerId) ?? [];
        pending.push(candidate);
        pendingRemoteCandidatesRef.current.set(peerId, pending);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on(SIGNALING_EVENTS.userJoined, handleUserJoined);
    socket.on(SIGNALING_EVENTS.signal, handleSignal);
    socket.io.on("reconnect_attempt", handleReconnectAttempt);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off(SIGNALING_EVENTS.userJoined, handleUserJoined);
      socket.off(SIGNALING_EVENTS.signal, handleSignal);
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
    };
  }, [addListener, createOfferForPeer, isBroadcasting, joinRoom, socket]);

  useEffect(() => {
    return () => {
      stopBroadcast();
      closeSocket();
    };
  }, [stopBroadcast]);

  const handleStart = async () => {
    try {
      await ensureSignalingReady();
      const stream = await captureDisplayAudio();
      streamRef.current = stream;
      setIsBroadcasting(true);
      setStatus("Broadcasting. Keep this tab active for best stability.");

      for (const track of stream.getTracks()) {
        track.onended = () => stopBroadcast();
      }

      for (const peerId of activeListeners) {
        await createOfferForPeer(peerId);
      }
    } catch (err) {
      setErrorText(String((err as Error)?.message || err));
      setErrorOpen(true);
      setStatus("Unable to start broadcast.");
    }
  };

  return (
    <main className="animate-float-up mx-auto grid min-h-screen w-full max-w-6xl gap-6 px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-6">
          <Card className="p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Laptop Sender</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-50">Broadcast laptop audio</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{status}</p>
                {connectionError ? <p className="mt-2 text-sm text-amber-300">{connectionError}</p> : null}
              </div>
              <StatusBadge active={isBroadcasting || signalingState === "connected"} activeLabel="Live" idleLabel="Idle" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleStart} disabled={!roomId || isBroadcasting || signalingState === "connecting"}>
                {signalingState === "connecting" ? "Connecting..." : "Start Broadcast"}
              </Button>
              <Button variant="secondary" onClick={stopBroadcast} disabled={!isBroadcasting}>
                Stop
              </Button>
              {(signalingState === "failed" || signalingState === "disconnected") && (
                <Button variant="secondary" onClick={handleRetryConnection}>
                  Retry Connection
                </Button>
              )}
              <Link href="/tool">
                <Button variant="ghost">Back to Tool</Button>
              </Link>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Session" value={roomId ? roomId.slice(0, 8) : "--"} hint="Active room ID" status="active" />
            <MetricCard
              label="Signaling"
              value={SIGNALING_LABELS[signalingState]}
              hint={hasJoinedRoom ? "Joined room on AWS signaling" : "Awaiting room join"}
              status={signalingState === "connected" ? "good" : signalingState === "failed" ? "default" : "active"}
            />
            <MetricCard
              label="Listeners"
              value={String(activeListeners.length)}
              hint="Phones detected in this room"
              status={activeListeners.length > 0 ? "good" : "default"}
            />
            <MetricCard
              label="Reconnects"
              value={String(reconnectCount)}
              hint="Socket recovery attempts"
              status={reconnectCount > 0 ? "active" : "default"}
            />
          </div>

          <Card className="p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Connections</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-50">Phone listeners</h2>
              </div>
              <span className="rounded-full border border-slate-700 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300">
                {SIGNALING_LABELS[signalingState]}
              </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              {activeListeners.length > 0
                ? `${activeListeners.length} listener(s) currently detected in this broadcast session.`
                : "No listeners connected yet. Keep this screen open and scan the QR from your phone."}
            </p>

            <div className="mt-5 grid gap-2">
              {activeListeners.length > 0 ? (
                activeListeners.map((listenerId, index) => (
                  <div
                    key={listenerId}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-white/[0.03] px-4 py-3"
                  >
                    <span className="text-sm font-medium text-slate-200">Listener {index + 1}</span>
                    <code className="text-xs text-indigo-200">{listenerId}</code>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-white/[0.02] px-4 py-6 text-sm text-slate-500">
                  Waiting for the first phone to join this session.
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="grid gap-6">
          {roomId ? <QRCodeCard roomId={roomId} pairUrl={pairUrl} /> : null}

          <Card className="p-6">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Broadcast Notes</p>
            <div className="mt-3 grid gap-3 text-sm leading-7 text-slate-400">
              <p>
                Signaling is routed through <code>{signalingHost}</code> over secure WebSocket transport.
              </p>
              <p>Choose the exact tab with active audio for the most reliable capture.</p>
              <p>Keep this tab active while broadcasting to reduce browser throttling and reconnect churn.</p>
            </div>
          </Card>
        </div>
      </section>

      <Dialog
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        title="Broadcast Error"
        description={errorText || "Unknown error occurred."}
      >
        <Button variant="secondary" onClick={() => setErrorOpen(false)}>
          Close
        </Button>
      </Dialog>
    </main>
  );
}
