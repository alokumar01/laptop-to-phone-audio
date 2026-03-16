"use client";

import { Card } from "@/components/ui/card";

interface AudioPlayerProps {
  connected: boolean;
  status: string;
  volume: number;
  onVolumeChange: (v: number) => void;
  onResumeAudio: () => void;
  needsResume: boolean;
}

export function AudioPlayer({
  connected,
  status,
  volume,
  onVolumeChange,
  onResumeAudio,
  needsResume,
}: AudioPlayerProps) {
  return (
    <Card className="grid gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Receiver</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-50">Live Audio</h3>
        </div>
        <span
          className={[
            "rounded-full border px-3 py-1 text-xs font-medium",
            connected
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-amber-500/30 bg-amber-500/10 text-amber-300",
          ].join(" ")}
        >
          {connected ? "Connected" : "Waiting"}
        </span>
      </div>

      <p className="text-sm leading-7 text-slate-400">{status}</p>

      <label className="grid gap-2 text-sm text-slate-300">
        Output Volume
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          className="accent-indigo-400"
        />
      </label>

      {needsResume ? (
        <button
          onClick={onResumeAudio}
          className="rounded-2xl border border-slate-700 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-600 hover:bg-white/[0.06]"
        >
          Tap To Resume Audio
        </button>
      ) : null}
    </Card>
  );
}
