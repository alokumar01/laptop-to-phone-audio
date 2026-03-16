import { Card } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  status?: "default" | "good" | "active";
}

const statusClass = {
  default: "text-slate-50",
  good: "text-emerald-400",
  active: "text-indigo-300",
} as const;

export function MetricCard({ label, value, hint, status = "default" }: MetricCardProps) {
  return (
    <Card className="grid gap-1 p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className={`text-2xl font-semibold ${statusClass[status]}`}>{value}</p>
      {hint ? <p className="text-sm text-slate-400">{hint}</p> : null}
    </Card>
  );
}
