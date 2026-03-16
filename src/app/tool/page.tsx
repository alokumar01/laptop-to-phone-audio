import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/content/FaqSection";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Audio Streaming Tool",
  description:
    "Open laptop sender and phone listener to stream laptop sound to phone speaker with QR-based WebRTC pairing.",
  path: "/tool",
  keywords: ["laptop sound to phone tool", "qr webrtc audio", "phone speaker web tool"],
});

const toolFaq = [
  {
    question: "Where should I start?",
    answer: "Open sender on laptop first, then scan the generated QR from your phone and start the listener.",
  },
  {
    question: "Why keep ads off the live tool routes?",
    answer: "Live audio controls need focus and low friction. Ads on the actual sender/listener pages would hurt usability.",
  },
  {
    question: "Can multiple phones join one session?",
    answer: "Yes. The signaling server supports multiple listeners up to the configured room limits.",
  },
  {
    question: "How do I improve reliability across networks?",
    answer: "Deploy on HTTPS and add TURN to your ICE configuration for non-LAN scenarios.",
  },
];

export default function ToolPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <Reveal>
        <section className="rounded-[2rem] border border-slate-800 bg-slate-950 px-8 py-10 shadow-xl md:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Tool Dashboard</p>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-50 md:text-6xl">
                Open the sender and listener dashboards.
              </h1>
              <p className="mt-4 text-base leading-8 text-slate-400">
                The live routes are optimized for actual pairing flow: session ID, QR connect, connection state, and
                low-latency playback visibility.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/share">
                <Button className="min-w-36">Open Sender</Button>
              </Link>
              <Link href="/listen">
                <Button variant="secondary" className="min-w-36">
                  Open Listener
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.06} className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard label="Setup Time" value="< 30 sec" hint="Laptop to phone pairing flow" status="active" />
        <MetricCard label="Transport" value="WebRTC" hint="Direct media path" />
        <MetricCard label="Pairing" value="QR + Room ID" hint="Low-friction session handoff" />
        <MetricCard label="Scale" value="1-to-many" hint="Multiple phone listeners" status="good" />
      </Reveal>

      <Reveal delay={0.1} className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="p-7">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Laptop Sender</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">Broadcast laptop audio</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Capture a tab or system source, keep the session active, and monitor listener readiness in a dedicated
            dashboard.
          </p>
          <ul className="mt-5 grid list-disc gap-2 pl-5 text-sm text-slate-400">
            <li>Session ID and QR pairing</li>
            <li>Live listener count</li>
            <li>Broadcast state and signaling join status</li>
            <li>Latency-oriented audio tuning</li>
          </ul>
          <div className="mt-6">
            <Link href="/share">
              <Button>Open Sender Dashboard</Button>
            </Link>
          </div>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Phone Listener</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">Receive live audio on phone</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Join from the QR link, watch signaling and WebRTC state, and control playback from a clean receiver panel.
          </p>
          <ul className="mt-5 grid list-disc gap-2 pl-5 text-sm text-slate-400">
            <li>Connection and playback indicators</li>
            <li>Latency target visibility</li>
            <li>Room ID awareness</li>
            <li>Manual resume path for autoplay restrictions</li>
          </ul>
          <div className="mt-6">
            <Link href="/listen">
              <Button variant="secondary">Open Listener Dashboard</Button>
            </Link>
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.14} className="mt-8">
        <FaqSection faqs={toolFaq} />
      </Reveal>

      <Reveal delay={0.18} className="mt-8">
        <AdSlot slot="tool-bottom" minHeight={160} />
      </Reveal>
    </main>
  );
}
