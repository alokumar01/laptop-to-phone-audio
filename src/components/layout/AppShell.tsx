"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const TOOL_ROUTES = new Set(["/share", "/listen"]);

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname ? TOOL_ROUTES.has(pathname) : false;

  return (
    <>
      {!hideChrome ? <SiteHeader /> : null}
      {children}
      {!hideChrome ? <SiteFooter /> : null}
    </>
  );
}
