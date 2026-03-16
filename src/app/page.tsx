import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { FaqSection } from "@/components/content/FaqSection";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Use Phone As Speaker For Laptop",
  description:
    "Stream laptop audio to phone instantly with browser WebRTC. QR pairing, low latency playback, and no app installation.",
  path: "/",
  keywords: ["use phone as speaker for laptop", "phone as wireless speaker", "laptop sound to phone"],
});

const homeFaq = [
  {
    question: "Can I use my phone as a laptop speaker without installing any app?",
    answer: "Yes. The product uses browser-based WebRTC pairing, so sender and listener work directly in the browser.",
  },
  {
    question: "Does this work for YouTube tab audio?",
    answer: "Yes. Select the correct tab in the capture picker and enable tab audio before starting the broadcast.",
  },
  {
    question: "Will this work across different networks?",
    answer: "It can, but production deployment should include TURN so calls survive NAT and restrictive networks.",
  },
  {
    question: "Where do ads appear?",
    answer: "Only on marketing and content surfaces. Ads are intentionally kept out of the live sender and listener UI.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 md:py-16">
      <Reveal>
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-8 py-10 shadow-xl md:px-12 md:py-14">
          <div className="hero-orb hero-orb-primary left-0 top-0 h-60 w-60 -translate-x-1/3 -translate-y-1/3" />
          <div className="hero-orb hero-orb-accent bottom-0 right-0 h-56 w-56 translate-x-1/4 translate-y-1/4" />

          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-indigo-200">
                Production-Ready Browser Audio
              </p>
              <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold leading-tight text-slate-50 md:text-7xl">
                Stream laptop audio to your phone with a clean SaaS-grade flow.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-400">
                Start a session on laptop, scan QR on phone, and play audio in seconds. No install friction, no account
                wall, and a UI that behaves like a real product instead of a demo.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/tool">
                  <Button className="min-w-36">Open Tool</Button>
                </Link>
                <Link href="/how-it-works">
                  <Button variant="secondary" className="min-w-36">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="grid gap-4 p-6">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Workflow</p>
              <div className="grid gap-3">
                {[
                  "Open sender on laptop",
                  "Capture tab or system audio",
                  "Scan QR from phone",
                  "Start listening and monitor status",
                ].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-white/[0.03] px-4 py-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-400/25 bg-indigo-500/10 text-sm font-semibold text-indigo-200">
                      {index + 1}
                    </span>
                    <span className="text-sm text-slate-300">{step}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <AdSlot slot="home-hero" minHeight={140} />
      </Reveal>

      <Reveal delay={0.08} className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-50">Real product UX</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Session state, connection health, QR pairing, and listener readiness are visible at a glance.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-50">Low-friction pairing</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            QR-based session links remove typing errors and make laptop-to-phone handoff instant.
          </p>
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-50">Scalable architecture</h2>
          <p className="mt-2 text-sm leading-7 text-slate-400">
            Signaling stays on the server while audio stays on peer media transport for better performance.
          </p>
        </Card>
      </Reveal>

      <Reveal delay={0.12} className="mt-8 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="p-7">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">How It Works</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-50">A faster path than Bluetooth or app installs</h2>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-slate-400">
            <p>Capture starts in the browser with `getDisplayMedia`.</p>
            <p>WebSocket signaling pairs laptop and phone through a session room.</p>
            <p>WebRTC streams audio directly to the phone browser with status-aware playback controls.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-300">
            <span className="rounded-full border border-slate-700 bg-white/[0.03] px-3 py-1">WebRTC</span>
            <span className="rounded-full border border-slate-700 bg-white/[0.03] px-3 py-1">QR Pairing</span>
            <span className="rounded-full border border-slate-700 bg-white/[0.03] px-3 py-1">Low Latency</span>
          </div>
        </Card>

        <Card className="p-7">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Key Guides</p>
          <div className="mt-3 grid gap-2">
            {[
              ["/use-phone-as-speaker", "Use Phone as Speaker"],
              ["/laptop-sound-to-phone", "Laptop Sound to Phone"],
              ["/phone-wireless-speaker", "Phone Wireless Speaker"],
              ["/turn-phone-into-speaker", "Turn Phone into Speaker"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-slate-800 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 transition hover:border-slate-700 hover:text-slate-50"
              >
                {label}
              </Link>
            ))}
          </div>
        </Card>
      </Reveal>

      <Reveal delay={0.16} className="mt-8">
        <AdSlot slot="home-mid" minHeight={160} />
      </Reveal>

      <Reveal delay={0.18} className="mt-10">
        <FaqSection faqs={homeFaq} />
      </Reveal>

      <Reveal delay={0.22} className="mt-10">
        <section className="rounded-[2rem] border border-slate-800 bg-slate-950 px-8 py-10 text-center shadow-xl">
          <h2 className="text-3xl font-semibold text-slate-50 md:text-4xl">Ready to run the live audio session?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Open the tool dashboard, start broadcast on laptop, and join from phone with the generated QR session.
          </p>
          <div className="mt-6">
            <Link href="/tool">
              <Button className="min-w-36">Launch Tool</Button>
            </Link>
          </div>
        </section>
      </Reveal>
    </main>
  );
}
