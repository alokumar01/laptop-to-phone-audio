interface StatusBadgeProps {
  active: boolean;
  activeLabel: string;
  idleLabel: string;
}

export function StatusBadge({ active, activeLabel, idleLabel }: StatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        active
          ? "pulse-glow border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          : "border-slate-700 bg-slate-800/80 text-slate-300",
      ].join(" ")}
    >
      <span className={["h-2 w-2 rounded-full", active ? "bg-emerald-400" : "bg-slate-500"].join(" ")} />
      {active ? activeLabel : idleLabel}
    </span>
  );
}
