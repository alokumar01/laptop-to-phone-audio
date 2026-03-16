import Link from "next/link";
import { FaqSection, type FaqItem } from "@/components/content/FaqSection";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SeoLandingPageProps {
  tag: string;
  title: string;
  subtitle: string;
  points: string[];
  checklist: string[];
  faqs: FaqItem[];
}

export function SeoLandingPage({ tag, title, subtitle, points, checklist, faqs }: SeoLandingPageProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-14">
      <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 md:p-10">
        <p className="text-xs tracking-[0.24em] text-blue-200/80">{tag}</p>
        <h1 className="mt-2 text-balance text-4xl font-semibold text-slate-50">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">{subtitle}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/tool">
            <Button>Open Tool</Button>
          </Link>
          <Link href="/how-it-works">
            <Button variant="secondary">How It Works</Button>
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {points.map((point) => (
          <Card key={point} className="grid gap-2">
            <h2 className="text-xl font-semibold text-slate-50">Benefit</h2>
            <p className="text-sm text-slate-300">{point}</p>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <Card className="grid gap-3">
          <h2 className="text-2xl font-semibold text-slate-50">Quick setup checklist</h2>
          <ul className="grid list-disc gap-2 pl-5 text-sm text-slate-300">
            {checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/share" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-slate-50">
              Open Sender
            </Link>
            <Link href="/listen" className="rounded-xl bg-green-500 px-4 py-2 text-sm font-semibold text-slate-950">
              Open Listener
            </Link>
          </div>
        </Card>
        <Card className="grid gap-3">
          <h2 className="text-2xl font-semibold text-slate-50">Intent-focused page</h2>
          <p className="text-sm leading-7 text-slate-400">
            This landing page is designed to match a specific search intent and route the user to the live tool without
            distracting them from the core action.
          </p>
          <p className="text-sm leading-7 text-slate-400">
            The page stays lightweight, readable, and directly connected to sender and listener routes for stronger SEO
            and better user flow.
          </p>
        </Card>
      </section>

      <section className="mt-10">
        <FaqSection faqs={faqs} />
      </section>
    </main>
  );
}
