import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={[
        "surface-panel rounded-2xl border border-slate-800 bg-slate-900 p-5 backdrop-blur-xl",
        "shadow-xl transition duration-300 hover:-translate-y-0.5 hover:border-slate-700",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}
