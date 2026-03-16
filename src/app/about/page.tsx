import { Card } from "@/components/ui/card";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Learn about Laptop Audio Share, our mission, architecture approach, and product principles for browser audio streaming.",
  path: "/about",
  keywords: ["about laptop audio share", "browser audio streaming mission"],
});

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 md:p-10">
        <p className="text-xs tracking-[0.24em] text-blue-200/80">ABOUT</p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-50">Built for practical laptop-to-phone audio streaming</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Laptop Audio Share was created for a simple user need: make laptop sound available on phone speakers without
          app installation and without complicated setup.
        </p>
      </section>

      <section className="mt-8 grid gap-4">
        <Card className="grid gap-3">
          <h2 className="text-2xl font-semibold text-slate-50">Our mission</h2>
          <p className="text-sm text-slate-300">
            We build browser-first tools that solve real problems quickly. Most users do not want to install desktop
            drivers, create accounts, or run background processes for a simple audio relay. They want a clean flow that
            starts in seconds and works on regular devices.
          </p>
          <p className="text-sm text-slate-300">
            Our mission is to deliver that speed while keeping architecture maintainable. We focus on session pairing,
            transparent connection state, and predictable troubleshooting. This helps both end users and technical teams
            maintain confidence in the product.
          </p>
        </Card>

        <Card className="grid gap-3">
          <h2 className="text-2xl font-semibold text-slate-50">How we build</h2>
          <p className="text-sm text-slate-300">
            The product uses WebRTC for media transport and a lightweight signaling layer for negotiation. This keeps
            server costs lower because audio is not relayed through central servers in normal conditions. It also helps
            users achieve lower latency when direct peer connectivity is available.
          </p>
          <p className="text-sm text-slate-300">
            We design UI around failure visibility. Instead of a generic connected state, we separate signaling joined,
            negotiating, and media connected states. This small detail saves major support time because users can see
            where setup is stuck.
          </p>
          <p className="text-sm text-slate-300">
            Security and abuse prevention are built into room/session handling. We validate room inputs, enforce
            listener limits, apply event rate limits, and clean stale sessions. For production deployment, we recommend
            TURN fallback, HTTPS, and continuous telemetry review.
          </p>
        </Card>

        <Card className="grid gap-3">
          <h2 className="text-2xl font-semibold text-slate-50">What matters to us</h2>
          <p className="text-sm text-slate-300">
            Clarity over hype. Fast onboarding over feature bloat. Practical documentation over vague marketing. Our
            blog and support pages are written to answer real setup questions from users trying to stream audio today,
            not generic theory detached from implementation.
          </p>
          <p className="text-sm text-slate-300">
            We also care about sustainable growth. That means technical SEO, policy transparency, and AdSense-safe page
            structure from day one. As the product grows, we keep legal pages, privacy disclosures, and architecture
            decisions visible and current.
          </p>
        </Card>

        <Card className="grid gap-3">
          <h2 className="text-2xl font-semibold text-slate-50">Our product principles</h2>
          <p className="text-sm text-slate-300">
            Principle one is speed with clarity. We avoid overloaded screens and focus on obvious actions: start
            broadcast, scan QR, start listening. Every state message is intentionally written to reduce guesswork. When
            users can understand a failure in one glance, support load drops and confidence rises.
          </p>
          <p className="text-sm text-slate-300">
            Principle two is architecture honesty. We clearly separate signaling and media to avoid confusion and to
            help teams scale responsibly. Signaling servers are lightweight and manageable. Media stays peer-to-peer
            whenever possible, reducing infrastructure pressure and preserving real-time performance characteristics.
          </p>
          <p className="text-sm text-slate-300">
            Principle three is transparent compliance. Growth tools such as analytics and ad networks should never be
            hidden from users. Privacy, terms, disclaimer, and cookie disclosures are part of product quality, not
            paperwork afterthoughts. We prefer clear policies that users can understand without legal background.
          </p>
        </Card>

        <Card className="grid gap-3">
          <h2 className="text-2xl font-semibold text-slate-50">Where we are heading</h2>
          <p className="text-sm text-slate-300">
            We plan to keep improving reliability across different networks and devices. That includes stronger TURN
            fallback patterns, better diagnostics, and clearer recovery actions when autoplay or permissions block
            playback. We also want to improve onboarding for first-time users with smarter prompts and state-aware help
            tips directly inside the interface.
          </p>
          <p className="text-sm text-slate-300">
            On the content side, we are expanding long-form practical guides built around real search intent: use phone
            as speaker, laptop sound to phone, turn phone into speaker, and related troubleshooting. The objective is to
            publish pages that are genuinely useful and technically accurate, not keyword stuffing.
          </p>
          <p className="text-sm text-slate-300">
            If you are a developer, educator, or creator working on browser media experiences, we welcome collaboration
            ideas. We believe practical open documentation and transparent product architecture can make web-based
            real-time tools easier to build, deploy, and maintain.
          </p>
        </Card>
      </section>
    </main>
  );
}
