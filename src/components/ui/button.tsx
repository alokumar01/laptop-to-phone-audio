import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "border border-indigo-400/50 bg-indigo-500 text-slate-50 shadow-[0_18px_50px_-18px_rgba(99,102,241,0.95)] hover:border-indigo-300 hover:bg-indigo-400",
  secondary:
    "border border-slate-700 bg-slate-900 text-slate-100 hover:border-slate-600 hover:bg-slate-800/90",
  ghost: "border border-transparent bg-transparent text-slate-200 hover:border-slate-700 hover:bg-white/5",
};

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-0",
        "hover:-translate-y-0.5",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClass[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
