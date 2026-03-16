import Link from "next/link";
import { FaqSection } from "@/components/content/FaqSection";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "How It Works",
  description:
    "Learn how laptop-to-phone audio streaming works with WebRTC, signaling, QR pairing, and secure browser playback.",
  path: "/how-it-works",
  keywords: ["how webrtc audio works", "qr audio pairing", "websocket signaling webrtc"],
});

const howFaq = [
  {
    question: "Is audio sent through the server?",
    answer: "No. The server handles signaling only. Audio is carried on the WebRTC peer connection.",
  },
  {
    question: "Why is HTTPS required in production?",
    answer: "Capture APIs like getDisplayMedia need secure context outside localhost.",
  },
  {
    question: "What if direct connection fails?",
    answer: "Use TURN relay as fallback in ICE configuration.",
  },
  {
    question: "Can this architecture scale?",
    answer: "Yes. Signaling scales separately while media remains direct between peers.",
  },
];

export default function HowItWorksPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Stream laptop audio to phone",
    step: [
      { "@type": "HowToStep", name: "Open Share on laptop" },
      { "@type": "HowToStep", name: "Capture tab/system audio" },
      { "@type": "HowToStep", name: "Scan QR with phone" },
      { "@type": "HowToStep", name: "Start listening" },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <JsonLd data={howToSchema} />

      <Reveal>
        <section className="rounded-[2rem] border border-slate-800 bg-slate-950 p-8 md:p-10">
          <p className="text-xs tracking-[0.24em] text-slate-500">System Design</p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-50">How laptop audio streaming works</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            The media path is peer-to-peer with WebRTC for low latency. Server handles signaling, room pairing, and
            connection coordination only.
          </p>
        </section>
      </Reveal>

      <Reveal delay={0.06} className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="grid gap-2 p-6">
          <h2 className="text-xl font-semibold text-slate-50">1. Capture</h2>
          <p className="text-sm leading-7 text-slate-400">Laptop uses `getDisplayMedia` to capture selected audio source.</p>
        </Card>
        <Card className="grid gap-2 p-6">
          <h2 className="text-xl font-semibold text-slate-50">2. Negotiate</h2>
          <p className="text-sm leading-7 text-slate-400">WebSocket signaling exchanges SDP offer, answer, and ICE candidates.</p>
        </Card>
        <Card className="grid gap-2 p-6">
          <h2 className="text-xl font-semibold text-slate-50">3. Playback</h2>
          <p className="text-sm leading-7 text-slate-400">Phone receives Opus audio and plays it through the browser output stack.</p>
        </Card>
      </Reveal>

      <Reveal delay={0.12} className="mt-8">
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="grid gap-4 p-7">
            <h2 className="text-2xl font-semibold text-slate-50">Architecture diagram</h2>
            <div className="grid gap-3 text-sm text-slate-200">
              <p className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-3">Laptop Browser (Sender)</p>
              <p className="text-center text-indigo-200">WebRTC Audio Media</p>
              <p className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-3">Phone Browser (Listener)</p>
              <p className="text-center text-slate-400">WebSocket Signaling via Next.js Server</p>
            </div>
            <div>
              <Link href="/tool">
                <Button>Try Live Tool</Button>
              </Link>
            </div>
          </Card>

          <Card className="grid gap-3 p-7">
            <h2 className="text-2xl font-semibold text-slate-50">Operational notes</h2>
            <p className="text-sm leading-7 text-slate-400">
              The clean split between signaling and media keeps the backend lighter and makes latency tuning easier to
              reason about.
            </p>
            <p className="text-sm leading-7 text-slate-400">
              For production, pair this model with HTTPS, TURN fallback, and clear diagnostics in the sender and
              listener dashboards.
            </p>
          </Card>
        </section>
      </Reveal>

      <section className="mt-10">
        <FaqSection faqs={howFaq} />
      </section>
    </main>
  );
}
