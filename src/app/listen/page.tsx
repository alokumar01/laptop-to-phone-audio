"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { closeSocket, getSocket } from "@/lib/socket";
import {
  RTC_CONFIGURATION,
  SIGNALING_EVENTS,
  type IceEvent,
  type OfferEvent,
  type PeerInfo,
} from "@/server/signaling";

const PLAYOUT_HINT_SEC = 0.01;
export const dynamic = "force-dynamic";

export default function ListenPage() {
  const searchParams = useSearchParams();
  const room = searchParams.get("room") || "";
  const roomMissing = !room;

  const [status, setStatus] = useState("Open this page from QR, then tap Start Listening.");
  const [connected, setConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [needsUserPlay, setNeedsUserPlay] = useState(false);
  const [volume, setVolume] = useState(1);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  const socket = useMemo(() => getSocket(), []);

  const roomRef = useRef(room);
  const senderIdRef = useRef<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const requestOfferNudge = useCallback(() => {
    if (!roomRef.current) return;
    socket.emit(SIGNALING_EVENTS.requestOffer, { room: roomRef.current });
  }, [socket]);

  const playIncomingStream = useCallback(async (stream: MediaStream) => {
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
      setStatus("Audio received. Tap play in audio control below.");
    }
  }, [volume]);

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

  const emitJoinRoom = useCallback(() => {
    if (!roomRef.current) return;
    socket.emit(SIGNALING_EVENTS.join, { room: roomRef.current, role: "listener" }, (response?: { ok?: boolean }) => {
      if (response?.ok) {
        setHasJoinedRoom(true);
        setStatus("Connected to signaling. Waiting for laptop offer...");
        requestOfferNudge();
      }
    });
  }, [requestOfferNudge, socket]);

  const getOrCreatePeerConnection = useCallback(async () => {
    if (pcRef.current) return pcRef.current;

    const pc = new RTCPeerConnection(RTC_CONFIGURATION);
    pcRef.current = pc;

    pc.onicecandidate = (event) => {
      if (!event.candidate || !senderIdRef.current) return;
      socket.emit(SIGNALING_EVENTS.ice, {
        room: roomRef.current,
        to: senderIdRef.current,
        candidate: event.candidate,
      });
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
      const s = pc.connectionState;
      if (s === "connected") {
        setConnected(true);
      } else if (s === "failed" || s === "disconnected" || s === "closed") {
        setConnected(false);
      }
    };

    return pc;
  }, [playIncomingStream, socket]);

  const handleStartListening = useCallback(() => {
    if (!roomRef.current) {
      setStatus("No room found. Scan QR from laptop share page.");
      return;
    }

    setIsListening(true);
    setHasJoinedRoom(false);
    setStatus("Joining room...");
    if (socket.connected) {
      emitJoinRoom();
    }
  }, [emitJoinRoom, socket]);

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
      setErrorText(String((err as Error).message || err));
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
      if (isListening && roomRef.current) {
        emitJoinRoom();
      }
    };

    const handleDisconnect = () => {
      setHasJoinedRoom(false);
      setConnected(false);
    };

    const handlePeers = (peers: PeerInfo[]) => {
      setHasJoinedRoom(true);
      setStatus("Connected to signaling. Waiting for laptop offer...");
      const sender = peers.find((peer) => peer.role === "sender");
      if (sender) {
        senderIdRef.current = sender.id;
        setStatus("Sender detected. Negotiating audio session...");
        requestOfferNudge();
      }
    };

    const handlePeerJoined = (peer: PeerInfo) => {
      if (peer.role === "sender") {
        senderIdRef.current = peer.id;
        setStatus("Laptop sender joined. Waiting for offer...");
        requestOfferNudge();
      }
    };

    const handlePeerLeft = ({ id }: { id: string }) => {
      if (senderIdRef.current === id) {
        senderIdRef.current = null;
        setConnected(false);
        setStatus("Sender disconnected. Waiting for reconnect...");
      }
    };

    const handleOffer = async ({ from, offer }: OfferEvent) => {
      if (!isListening) return;

      senderIdRef.current = from;
      const pc = await getOrCreatePeerConnection();

      await pc.setRemoteDescription(offer);

      for (const candidate of pendingCandidatesRef.current) {
        await pc.addIceCandidate(candidate);
      }
      pendingCandidatesRef.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit(SIGNALING_EVENTS.answer, {
        room: roomRef.current,
        to: from,
        answer: pc.localDescription,
      });

      setStatus("Offer accepted. Starting audio...");
    };

    const handleIce = async ({ from, candidate }: IceEvent) => {
      if (!isListening) return;
      if (senderIdRef.current && senderIdRef.current !== from) return;
      if (!candidate) return;

      const pc = await getOrCreatePeerConnection();
      if (pc.remoteDescription) {
        await pc.addIceCandidate(candidate);
      } else {
        pendingCandidatesRef.current.push(candidate);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(SIGNALING_EVENTS.peers, handlePeers);
    socket.on(SIGNALING_EVENTS.peerJoined, handlePeerJoined);
    socket.on(SIGNALING_EVENTS.peerLeft, handlePeerLeft);
    socket.on(SIGNALING_EVENTS.offer, (payload: OfferEvent) => {
      handleOffer(payload).catch((err) => {
        setErrorText(String(err?.message || err));
        setErrorOpen(true);
      });
    });
    socket.on(SIGNALING_EVENTS.ice, (payload: IceEvent) => {
      handleIce(payload).catch((err) => {
        setErrorText(String(err?.message || err));
        setErrorOpen(true);
      });
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(SIGNALING_EVENTS.peers, handlePeers);
      socket.off(SIGNALING_EVENTS.peerJoined, handlePeerJoined);
      socket.off(SIGNALING_EVENTS.peerLeft, handlePeerLeft);
      socket.off(SIGNALING_EVENTS.offer);
      socket.off(SIGNALING_EVENTS.ice);
    };
  }, [emitJoinRoom, getOrCreatePeerConnection, isListening, requestOfferNudge, socket]);

  useEffect(() => {
    if (isListening && socket.connected && roomRef.current) {
      emitJoinRoom();
    }
  }, [emitJoinRoom, isListening, socket]);

  useEffect(() => {
    if (!isListening || connected || !hasJoinedRoom || !socket.connected) return;
    const interval = setInterval(() => {
      requestOfferNudge();
    }, 2000);
    return () => clearInterval(interval);
  }, [connected, hasJoinedRoom, isListening, requestOfferNudge, socket]);

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
              </div>
              <StatusBadge active={connected} activeLabel="Connected" idleLabel="Standby" />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
              Room: {room ? <code className="text-indigo-200">{room}</code> : <span className="text-amber-300">missing</span>}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleStartListening} disabled={roomMissing || isListening}>
                Start Listening
              </Button>
              <Button variant="secondary" onClick={handleStopListening} disabled={!isListening}>
                Stop
              </Button>
              <Link href="/tool">
                <Button variant="ghost">Back to Tool</Button>
              </Link>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Session"
              value={room ? room.slice(0, 8) : "--"}
              hint="Current room ID"
              status="active"
            />
            <MetricCard
              label="Signaling"
              value={hasJoinedRoom ? "Joined" : "Waiting"}
              hint="Socket room state"
              status={hasJoinedRoom ? "good" : "default"}
            />
            <MetricCard
              label="WebRTC"
              value={connected ? "Live" : "Negotiating"}
              hint="Peer media state"
              status={connected ? "good" : "active"}
            />
            <MetricCard label="Latency" value={`${(PLAYOUT_HINT_SEC * 1000).toFixed(0)}ms`} hint="Playout target" status="active" />
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
                ["Socket room", hasJoinedRoom ? "joined" : "not joined"],
                ["WebRTC", connected ? "connected" : "negotiating"],
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
              <p>Start listening only after the laptop sender has joined the room.</p>
              <p>If audio is silent on mobile, use the resume button once to satisfy autoplay rules.</p>
              <p>Keep the screen awake while testing connection stability on mobile browsers.</p>
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
