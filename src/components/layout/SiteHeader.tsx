import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/90 bg-[rgb(11_15_25/0.8)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-5 px-6 py-4">
        <Link href="/" className="group inline-flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-400/35 bg-indigo-500/15 text-sm font-semibold text-slate-50">
            LA
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">WebRTC Audio</p>
            <p className="text-sm font-semibold text-slate-50 transition group-hover:text-white">{siteConfig.shortName}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {siteConfig.nav.map((item) => {
            const isExternal = item.href.startsWith("http");
            return (
              <Link
                key={item.href}
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noreferrer" : undefined}
                className="rounded-2xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/tool">
          <Button className="min-w-28">Open Tool</Button>
        </Link>
      </div>
    </header>
  );
}
