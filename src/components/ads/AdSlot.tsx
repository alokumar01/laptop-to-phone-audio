"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slot: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal";
  minHeight?: number;
}

const ADS_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
const ADS_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID;

export function AdSlot({ slot, className = "", format = "auto", minHeight = 180 }: AdSlotProps) {
  useEffect(() => {
    if (!ADS_ENABLED || !ADS_CLIENT || typeof window === "undefined") return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Swallow AdSense runtime issues to avoid blocking the page.
    }
  }, []);

  if (!ADS_ENABLED || !ADS_CLIENT || !slot) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={[
        "overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 shadow-xl",
        className,
      ].join(" ")}
      style={{ minHeight }}
    >
      <ins
        className="adsbygoogle block h-full w-full"
        style={{ display: "block", minHeight }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
