"use client";

import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";

interface QRCodeCardProps {
  roomId: string;
  pairUrl: string;
}

export function QRCodeCard({ roomId, pairUrl }: QRCodeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="grid gap-5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pairing</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-50">Scan With Phone</h3>
          </div>
          <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
            Session Live
          </span>
        </div>

        <div className="rounded-[1.75rem] bg-white p-5 shadow-[0_24px_70px_-35px_rgba(255,255,255,0.65)]">
          <QRCode value={pairUrl} size={220} style={{ width: "100%", height: "auto" }} />
        </div>

        <div className="grid gap-3 text-xs text-slate-300">
          <div className="grid gap-1">
            <span className="text-slate-500">Session ID</span>
            <code className="rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-[13px] text-indigo-200">
              {roomId}
            </code>
          </div>
          <div className="grid gap-1">
            <span className="text-slate-500">Pair URL</span>
            <code className="rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-[11px] text-slate-400">
              {pairUrl}
            </code>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
