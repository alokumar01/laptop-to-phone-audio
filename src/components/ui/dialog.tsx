import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  children?: ReactNode;
  onClose: () => void;
}

export function Dialog({ open, title, description, children, onClose }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[rgb(11_15_25/0.76)] p-4 backdrop-blur-md" onClick={onClose}>
      <div
        className="surface-panel w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/95 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-slate-50">{title}</h3>
        {description ? <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p> : null}
        {children ? <div className="mt-4">{children}</div> : null}
      </div>
    </div>
  );
}
