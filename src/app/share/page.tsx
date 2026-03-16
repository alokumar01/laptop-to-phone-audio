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
import { getSocket, closeSocket } from "@/lib/socket";
import { captureDisplayAudio, forceLowLatencyOpus } from "@/lib/webrtc";
import { RTC_CONFIGURATION, SIGNALING_EVENTS, type AnswerEvent, type IceEvent, type PeerInfo, type PeerRole } from "@/server/signaling";

export const dynamic = "force-dynamic";

export default function SharePage() {
  const [roomId] = useState(() => uuidv4());
  const [receiverOrigin, setReceiverOrigin] = useState(() =>
    typeof window !== "undefined" ? window.location.origin : ""
  );
  const [status, setStatus] = useState("Session created. Start broadcast and scan QR from phone.");
  const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
  const [activeListeners, setActiveListeners] = useState<string[]>([]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  const streamRef = useRef<MediaStream | null>(null);
  const roomRef = useRef(roomId);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const pendingRemoteCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const peerRolesRef = useRef<Map<string, PeerRole>>(new Map());

  const socket = useMemo(() => getSocket(), []);
  const pairUrl = useMemo(
    () => (receiverOrigin ? `${receiverOrigin}/listen?room=${roomId}` : ""),
    [receiverOrigin, roomId]
  );

  const joinRoomWithAck = useCallback(async () => {
    if (!socket.connected) return false;

    const ok = await new Promise<boolean>((resolve) => {
      socket.emit(SIGNALING_EVENTS.join, { room: roomId, role: "sender" }, (response?: { ok?: boolean }) => {
        resolve(Boolean(response?.ok));
      });
    });

    setHasJoinedRoom(ok);
    return ok;
  }, [roomId, socket]);

  const ensureSenderJoined = useCallback(
    async (maxAttempts = 4) => {
      for (let i = 0; i < maxAttempts; i += 1) {
        if (!socket.connected) {
          socket.connect();
          await new Promise((resolve) => setTimeout(resolve, 250));
          continue;
        }

        const ok = await joinRoomWithAck();
        if (ok) return true;
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      return false;
    },
    [joinRoomWithAck, socket]
  );

  const emitJoinRoom = useCallback(() => {
    ensureSenderJoined().catch(() => undefined);
  }, [ensureSenderJoined]);

  const closePeer = useCallback((peerId: string) => {
    const pc = peerConnectionsRef.current.get(peerId);
    if (!pc) return;
    pc.onicecandidate = null;
    pc.ontrack = null;
    pc.onconnectionstatechange = null;
    pc.close();
    peerConnectionsRef.current.delete(peerId);
    pendingRemoteCandidatesRef.current.delete(peerId);
  }, []);

  const stopBroadcast = useCallback(() => {
    for (const peerId of peerConnectionsRef.current.keys()) {
      closePeer(peerId);
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }

    setIsBroadcasting(false);
    setStatus("Broadcast stopped. Ready to restart.");
  }, [closePeer]);

  const tuneSender = useCallback(async (sender: RTCRtpSender) => {
    if (!sender.getParameters || !sender.setParameters) return;
    const params = sender.getParameters();
    if (!params.encodings || !params.encodings.length) params.encodings = [{}];
    params.encodings[0].maxBitrate = 128000;
    try {
      await sender.setParameters(params);
    } catch {
      // Browser might block dynamic changes for this track.
    }
  }, []);

  const createOfferForPeer = useCallback(
    async (peerId: string) => {
      if (!streamRef.current || !roomRef.current) return;

      let pc = peerConnectionsRef.current.get(peerId);
      if (!pc) {
        pc = new RTCPeerConnection(RTC_CONFIGURATION);
        peerConnectionsRef.current.set(peerId, pc);
        const createdPc = pc;

        for (const track of streamRef.current.getAudioTracks()) {
          const sender = createdPc.addTrack(track, streamRef.current);
          await tuneSender(sender);
        }

        createdPc.onicecandidate = (event) => {
          if (!event.candidate) return;
          socket.emit(SIGNALING_EVENTS.ice, {
            room: roomRef.current,
            to: peerId,
            candidate: event.candidate,
          });
        };

        createdPc.onconnectionstatechange = () => {
          const state = createdPc.connectionState;
          if (state === "failed" || state === "disconnected" || state === "closed") {
            closePeer(peerId);
            setActiveListeners((prev) => prev.filter((id) => id !== peerId));
          }
        };
      }

      const activePc = pc;
      if (!activePc) return;

      const offer = await activePc.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false });
      offer.sdp = forceLowLatencyOpus(offer.sdp ?? "");
      await activePc.setLocalDescription(offer);

      socket.emit(SIGNALING_EVENTS.offer, {
        room: roomRef.current,
        to: peerId,
        offer: activePc.localDescription,
      });
    },
    [closePeer, socket, tuneSender]
  );

  useEffect(() => {
    let cancelled = false;

    const loadReachableOrigin = async () => {
      try {
        const res = await fetch("/api/host-info", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { origin?: string };
        if (!cancelled && data.origin) {
          setReceiverOrigin(data.origin);
        }
      } catch {
        // Keep current origin fallback.
      }
    };

    loadReachableOrigin().catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const handleConnect = () => {
      emitJoinRoom();
    };

    const handleDisconnect = () => {
      setHasJoinedRoom(false);
      setActiveListeners([]);
    };

    const handlePeers = (peers: PeerInfo[]) => {
      setHasJoinedRoom(true);
      peerRolesRef.current.clear();
      const listeners = peers.filter((peer) => peer.role === "listener");

      for (const peer of peers) {
        peerRolesRef.current.set(peer.id, peer.role);
      }

      setActiveListeners(listeners.map((peer) => peer.id));
      if (streamRef.current) {
        for (const listener of listeners) {
          createOfferForPeer(listener.id).catch((err) => {
            setErrorText(String(err?.message || err));
            setErrorOpen(true);
          });
        }
      }
    };

    const handlePeerJoined = (peer: PeerInfo) => {
      peerRolesRef.current.set(peer.id, peer.role);
      if (peer.role === "listener") {
        setActiveListeners((prev) => (prev.includes(peer.id) ? prev : [...prev, peer.id]));
        if (streamRef.current) {
          createOfferForPeer(peer.id).catch((err) => {
            setErrorText(String(err?.message || err));
            setErrorOpen(true);
          });
        }
      }
    };

    const handleListenerReady = ({ id }: { id: string }) => {
      if (!id) return;
      peerRolesRef.current.set(id, "listener");
      setActiveListeners((prev) => (prev.includes(id) ? prev : [...prev, id]));
      if (streamRef.current) {
        createOfferForPeer(id).catch((err) => {
          setErrorText(String(err?.message || err));
          setErrorOpen(true);
        });
      }
    };

    const handlePeerLeft = ({ id }: { id: string }) => {
      peerRolesRef.current.delete(id);
      setActiveListeners((prev) => prev.filter((peerId) => peerId !== id));
      closePeer(id);
    };

    const handleAnswer = async ({ from, answer }: AnswerEvent) => {
      const pc = peerConnectionsRef.current.get(from);
      if (!pc || !answer) return;
      await pc.setRemoteDescription(answer);

      const pending = pendingRemoteCandidatesRef.current.get(from) ?? [];
      for (const candidate of pending) {
        await pc.addIceCandidate(candidate);
      }
      pendingRemoteCandidatesRef.current.set(from, []);
    };

    const handleIce = async ({ from, candidate }: IceEvent) => {
      const pc = peerConnectionsRef.current.get(from);
      if (!pc || !candidate) return;
      if (pc.remoteDescription) {
        await pc.addIceCandidate(candidate);
      } else {
        const pending = pendingRemoteCandidatesRef.current.get(from) ?? [];
        pending.push(candidate);
        pendingRemoteCandidatesRef.current.set(from, pending);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(SIGNALING_EVENTS.peers, handlePeers);
    socket.on(SIGNALING_EVENTS.peerJoined, handlePeerJoined);
    socket.on(SIGNALING_EVENTS.peerLeft, handlePeerLeft);
    socket.on(SIGNALING_EVENTS.listenerReady, handleListenerReady);
    socket.on(SIGNALING_EVENTS.answer, (payload: AnswerEvent) => {
      handleAnswer(payload).catch(() => undefined);
    });
    socket.on(SIGNALING_EVENTS.ice, (payload: IceEvent) => {
      handleIce(payload).catch(() => undefined);
    });

    if (socket.connected) emitJoinRoom();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(SIGNALING_EVENTS.peers, handlePeers);
      socket.off(SIGNALING_EVENTS.peerJoined, handlePeerJoined);
      socket.off(SIGNALING_EVENTS.peerLeft, handlePeerLeft);
      socket.off(SIGNALING_EVENTS.listenerReady, handleListenerReady);
      socket.off(SIGNALING_EVENTS.answer);
      socket.off(SIGNALING_EVENTS.ice);
    };
  }, [closePeer, createOfferForPeer, emitJoinRoom, roomId, socket]);

  useEffect(() => {
    if (!isBroadcasting || !socket.connected) return;
    const interval = setInterval(() => {
      emitJoinRoom();
    }, 10000);
    return () => clearInterval(interval);
  }, [emitJoinRoom, isBroadcasting, socket]);

  useEffect(() => {
    return () => {
      stopBroadcast();
      closeSocket();
    };
  }, [stopBroadcast]);

  const handleStart = async () => {
    try {
      const joined = await ensureSenderJoined(8);
      if (!joined) {
        throw new Error("Signaling join failed on sender. Refresh page and retry.");
      }
      const stream = await captureDisplayAudio();
      streamRef.current = stream;
      setIsBroadcasting(true);
      setStatus("Broadcasting. Keep this tab active for best stability.");

      for (const track of stream.getTracks()) {
        track.onended = () => stopBroadcast();
      }

      for (const [peerId, role] of peerRolesRef.current.entries()) {
        if (role === "listener") {
          await createOfferForPeer(peerId);
        }
      }
    } catch (err) {
      setErrorText(String((err as Error).message || err));
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
              </div>
              <StatusBadge active={isBroadcasting} activeLabel="Live" idleLabel="Idle" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleStart} disabled={isBroadcasting}>
                Start Broadcast
              </Button>
              <Button variant="secondary" onClick={stopBroadcast} disabled={!isBroadcasting}>
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
              value={roomId.slice(0, 8)}
              hint="Active room ID"
              status="active"
            />
            <MetricCard
              label="Signaling"
              value={hasJoinedRoom ? "Joined" : "Waiting"}
              hint="Room connection state"
              status={hasJoinedRoom ? "good" : "default"}
            />
            <MetricCard
              label="Listeners"
              value={String(activeListeners.length)}
              hint="Currently attached phones"
              status={activeListeners.length > 0 ? "good" : "default"}
            />
            <MetricCard label="Latency" value="10ms" hint="Target Opus profile" status="active" />
          </div>

          <Card className="p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Connections</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-50">Phone listeners</h2>
              </div>
              <span className="rounded-full border border-slate-700 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300">
                {hasJoinedRoom ? "Room joined" : "Joining room"}
              </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-slate-400">
              {activeListeners.length > 0
                ? `${activeListeners.length} listener(s) currently connected to this broadcast session.`
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
          {pairUrl ? <QRCodeCard roomId={roomId} pairUrl={pairUrl} /> : null}
          <Card className="p-6">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Broadcast Notes</p>
            <div className="mt-3 grid gap-3 text-sm leading-7 text-slate-400">
              <p>Choose the exact tab with active audio for the most reliable capture.</p>
              <p>Keep this tab active while broadcasting to reduce browser throttling.</p>
              <p>For different networks, add TURN before production launch.</p>
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
