"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { publicEnv } from "@/lib/env";
import { closeSocket, getSocket, waitForSocketConnection } from "@/lib/socket";
import {
  RTC_CONFIGURATION,
  SIGNALING_EVENTS,
  type ConnectionState,
  type SignalEvent,
  type UserJoinedEvent,
} from "@/lib/signaling";

const PLAYOUT_HINT_SEC = 0.01;
const SIGNALING_LABELS: Record<ConnectionState, string> = {
  idle: "Idle",
  connecting: "Connecting...",
  connected: "Connected",
  reconnecting: "Reconnecting...",
  failed: "Connection failed",
  disconnected: "Disconnected",
};

export const dynamic = "force-dynamic";

function ListenPageContent() {
  const signalingHost = useMemo(() => new URL(publicEnv.signalingUrl).host, []);
  const searchParams = useSearchParams();
  const room = searchParams.get("room") || "";
  const roomMissing = !room;

  const [status, setStatus] = useState("Connecting to signaling server...");
  const [connected, setConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [needsUserPlay, setNeedsUserPlay] = useState(false);
  const [volume, setVolume] = useState(1);
  const [signalingState, setSignalingState] = useState<ConnectionState>("connecting");
  const [connectionError, setConnectionError] = useState("");
  const [reconnectCount, setReconnectCount] = useState(0);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  const socket = useMemo(() => getSocket(), []);
  const roomRef = useRef(room);
  const senderIdRef = useRef<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const joinRoom = useCallback(() => {
    if (!roomRef.current) return;
    socket.emit(SIGNALING_EVENTS.join, { room: roomRef.current, role: "listener" });
    setHasJoinedRoom(true);
  }, [socket]);

  const playIncomingStream = useCallback(
    async (stream: MediaStream) => {
      const audioEl = audioElRef.current;
      if (!audioEl) return;

      if (audioEl.srcObject !== stream) {
        audioEl.srcObject = stream;
      }

      audioEl.volume = volume;

      try {
        await audioEl.play();
        setNeedsUserPlay(false);
        setStatus("Streaming live audio");
      } catch {
        setNeedsUserPlay(true);
        setStatus("Audio received. Tap resume playback below.");
      }
    },
    [volume]
  );

  const cleanupConnection = useCallback(() => {
    if (pcRef.current) {
      pcRef.current.onicecandidate = null;
      pcRef.current.ontrack = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }

    senderIdRef.current = null;
    pendingCandidatesRef.current = [];
    setConnected(false);

    const audioEl = audioElRef.current;
    if (audioEl) {
      audioEl.pause();
      audioEl.srcObject = null;
    }
  }, []);

  const getOrCreatePeerConnection = useCallback(async () => {
    if (pcRef.current) return pcRef.current;

    const pc = new RTCPeerConnection(RTC_CONFIGURATION);
    pcRef.current = pc;

    pc.onicecandidate = (event) => {
      if (!event.candidate || !senderIdRef.current) return;
      socket.emit(SIGNALING_EVENTS.signal, {
        room: roomRef.current,
        to: senderIdRef.current,
        role: "listener",
        type: "ice",
        payload: event.candidate.toJSON(),
      } satisfies SignalEvent<RTCIceCandidateInit>);
    };

    pc.ontrack = async (event) => {
      const receiver = pc.getReceivers().find((r) => r.track && r.track.kind === "audio");
      if (receiver && "playoutDelayHint" in receiver) {
        receiver.playoutDelayHint = PLAYOUT_HINT_SEC;
      }

      const stream = event.streams[0] || new MediaStream([event.track]);
      await playIncomingStream(stream);
      setConnected(true);
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === "connected") {
        setConnected(true);
      } else if (state === "failed" || state === "disconnected" || state === "closed") {
        setConnected(false);
      }
    };

    return pc;
  }, [playIncomingStream, socket]);

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

  const handleStartListening = useCallback(async () => {
    if (!roomRef.current) {
      setStatus("No room found. Scan QR from the sender page.");
      return;
    }

    try {
      setIsListening(true);
      setStatus("Connecting...");
      await ensureSignalingReady();
      setStatus("Connected to signaling. Waiting for laptop sender...");
    } catch (err) {
      setConnectionError(String((err as Error)?.message || err));
      setSignalingState("failed");
      setStatus("Connection failed. Retry signaling and start again.");
    }
  }, [ensureSignalingReady]);

  const handleStopListening = useCallback(() => {
    setIsListening(false);
    setHasJoinedRoom(false);
    cleanupConnection();
    setStatus("Listening stopped.");
  }, [cleanupConnection]);

  const handleResumePlayback = useCallback(async () => {
    const audioEl = audioElRef.current;
    if (!audioEl) return;

    try {
      await audioEl.play();
      setNeedsUserPlay(false);
      setStatus("Streaming live audio");
    } catch (err) {
      setErrorText(String((err as Error)?.message || err));
      setErrorOpen(true);
    }
  }, []);

  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  useEffect(() => {
    const audioEl = audioElRef.current;
    if (audioEl) {
      audioEl.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const handleConnect = () => {
      setReconnectCount(0);
      setSignalingState("connected");
      setConnectionError("");
      if (isListening && roomRef.current) {
        joinRoom();
        setStatus("Connected to signaling. Waiting for laptop sender...");
      } else {
        setStatus("Connected to signaling. Tap Start Listening when ready.");
      }
    };

    const handleConnectError = (err: Error) => {
      setSignalingState("failed");
      setConnectionError(err.message || "Unable to reach signaling server.");
      setStatus("Connection failed. Check the signaling server and retry.");
    };

    const handleDisconnect = (reason: string) => {
      setHasJoinedRoom(false);
      setConnected(false);
      setSignalingState(reason === "io client disconnect" ? "idle" : "disconnected");
      setStatus("Signaling disconnected. Waiting for reconnect or manual retry.");
    };

    const handleReconnectAttempt = (attempt: number) => {
      setReconnectCount(attempt);
      setSignalingState("reconnecting");
      setStatus(`Reconnecting to signaling server... attempt ${attempt}`);
    };

    const handleUserJoined = (peer: UserJoinedEvent) => {
      if (!peer.id || peer.id === socket.id) return;
      if (!senderIdRef.current && peer.role !== "listener") {
        senderIdRef.current = peer.id;
        setStatus("Sender detected. Waiting for offer...");
      }
    };

    const handleSignal = async (event: SignalEvent) => {
      if (!isListening || !event.payload) return;

      if (event.from) {
        senderIdRef.current = event.from;
      }

      if (event.type === "offer") {
        const pc = await getOrCreatePeerConnection();
        await pc.setRemoteDescription(event.payload as RTCSessionDescriptionInit);

        for (const candidate of pendingCandidatesRef.current) {
          await pc.addIceCandidate(candidate);
        }
        pendingCandidatesRef.current = [];

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        if (!pc.localDescription) {
          throw new Error("Listener answer could not be created.");
        }

        socket.emit(SIGNALING_EVENTS.signal, {
          room: roomRef.current,
          to: senderIdRef.current ?? undefined,
          role: "listener",
          type: "answer",
          payload: pc.localDescription,
        } satisfies SignalEvent<RTCSessionDescriptionInit>);

        setStatus("Offer accepted. Starting audio...");
      }

      if (event.type === "ice") {
        const candidate = event.payload as RTCIceCandidateInit;
        const pc = await getOrCreatePeerConnection();
        if (pc.remoteDescription) {
          await pc.addIceCandidate(candidate);
        } else {
          pendingCandidatesRef.current.push(candidate);
        }
      }
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on(SIGNALING_EVENTS.userJoined, handleUserJoined);
    socket.on(SIGNALING_EVENTS.signal, (event: SignalEvent) => {
      handleSignal(event).catch((err) => {
        setErrorText(String((err as Error)?.message || err));
        setErrorOpen(true);
      });
    });
    socket.io.on("reconnect_attempt", handleReconnectAttempt);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("disconnect", handleDisconnect);
      socket.off(SIGNALING_EVENTS.userJoined, handleUserJoined);
      socket.off(SIGNALING_EVENTS.signal);
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
    };
  }, [getOrCreatePeerConnection, isListening, joinRoom, socket]);

  useEffect(() => {
    return () => {
      cleanupConnection();
      closeSocket();
    };
  }, [cleanupConnection]);

  return (
    <main className="animate-float-up mx-auto grid min-h-screen w-full max-w-6xl gap-6 px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="grid gap-6">
          <Card className="p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Phone Listener</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-50">Receive live audio</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                  {roomMissing ? "No room found. Scan the QR from your laptop sender screen." : status}
                </p>
                {connectionError ? <p className="mt-2 text-sm text-amber-300">{connectionError}</p> : null}
              </div>
              <StatusBadge active={connected || signalingState === "connected"} activeLabel="Connected" idleLabel="Standby" />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
              Room: {room ? <code className="text-indigo-200">{room}</code> : <span className="text-amber-300">missing</span>}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => void handleStartListening()} disabled={roomMissing || isListening || signalingState === "connecting"}>
                {signalingState === "connecting" ? "Connecting..." : "Start Listening"}
              </Button>
              <Button variant="secondary" onClick={handleStopListening} disabled={!isListening}>
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
            <MetricCard label="Session" value={room ? room.slice(0, 8) : "--"} hint="Current room ID" status="active" />
            <MetricCard
              label="Signaling"
              value={SIGNALING_LABELS[signalingState]}
              hint={hasJoinedRoom ? "Joined room on AWS signaling" : "Awaiting room join"}
              status={signalingState === "connected" ? "good" : signalingState === "failed" ? "default" : "active"}
            />
            <MetricCard
              label="WebRTC"
              value={connected ? "Live" : "Waiting"}
              hint="Peer media state"
              status={connected ? "good" : "active"}
            />
            <MetricCard
              label="Reconnects"
              value={String(reconnectCount)}
              hint="Socket recovery attempts"
              status={reconnectCount > 0 ? "active" : "default"}
            />
          </div>

          <Card className="p-7">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Playback</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50">Audio output</h2>

            <audio ref={audioElRef} autoPlay playsInline controls className="mt-5 w-full rounded-2xl" />

            <label className="mt-5 grid gap-2 text-sm font-medium text-slate-300">
              Output volume
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="accent-indigo-400"
              />
            </label>

            {needsUserPlay ? (
              <Button variant="secondary" className="mt-5" onClick={handleResumePlayback}>
                Resume Playback
              </Button>
            ) : null}
          </Card>
        </div>

        <div className="grid gap-6">
          <Card className="p-7">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Connection Detail</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-50">Session health</h2>
            <div className="mt-5 grid gap-3">
              {[
                ["Socket", SIGNALING_LABELS[signalingState]],
                ["Room", hasJoinedRoom ? "joined" : "waiting"],
                ["WebRTC", connected ? "connected" : "waiting for media"],
                ["Playback", needsUserPlay ? "awaiting resume" : "ready"],
                ["Latency hint", `${(PLAYOUT_HINT_SEC * 1000).toFixed(0)}ms`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-white/[0.03] px-4 py-3"
                >
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="text-sm font-medium text-slate-200">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Listener Notes</p>
            <div className="mt-3 grid gap-3 text-sm leading-7 text-slate-400">
              <p>
                Signaling is handled by <code>{signalingHost}</code> over secure WebSocket transport.
              </p>
              <p>Start listening after the laptop sender is open on the same room link.</p>
              <p>If audio is silent on mobile, use the resume button once to satisfy autoplay rules.</p>
            </div>
          </Card>
        </div>
      </section>

      <Dialog
        open={errorOpen}
        onClose={() => setErrorOpen(false)}
        title="Listener Error"
        description={errorText || "Unknown error occurred."}
      >
        <Button variant="secondary" onClick={() => setErrorOpen(false)}>
          Close
        </Button>
      </Dialog>
    </main>
  );
}

export default function ListenPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-6 px-6 py-10">
          <Card className="p-7">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Phone Listener</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">Preparing listener session</h1>
            <p className="mt-3 text-sm leading-7 text-slate-400">
              Loading room details and connection controls.
            </p>
          </Card>
        </main>
      }
    >
      <ListenPageContent />
    </Suspense>
  );
}
