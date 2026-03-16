import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-[rgb(11_15_25/0.88)]">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3 md:col-span-1">
            <p className="text-xs tracking-[0.22em] text-slate-500">{siteConfig.name.toUpperCase()}</p>
            <h2 className="text-xl font-semibold text-slate-50">Low-latency audio from laptop to phone.</h2>
            <p className="max-w-xl text-sm text-slate-300">
              Secure browser-only streaming. No app install, no account needed, instant QR pairing.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-100">Product</p>
            {siteConfig.productNav.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-slate-400 hover:text-slate-100">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-100">Company</p>
            {siteConfig.companyNav.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-slate-400 hover:text-slate-100">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-100">Legal</p>
            {siteConfig.legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="block text-sm text-slate-400 hover:text-slate-100">
                {item.label}
              </Link>
            ))}
            <p className="pt-3 text-sm font-semibold text-slate-100">Follow</p>
            <Link href={siteConfig.github} className="block text-sm text-slate-400 hover:text-slate-100">
              GitHub: {siteConfig.githubHandle}
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-4 text-sm text-slate-400">
          Built by {siteConfig.author} | GitHub:{" "}
          <Link href={siteConfig.github} className="text-indigo-300 hover:text-slate-100">
            {siteConfig.githubHandle}
          </Link>
        </div>
      </div>
    </footer>
  );
}
