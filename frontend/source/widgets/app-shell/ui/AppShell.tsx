"use client";

import { usePathname } from "next/navigation";
import { SidebarShell } from "@/source/widgets/sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

const SIDEBAR_ROUTES = [
  /^\/customer\/orders(?:\/.*)?$/,
  /^\/expert\/orders(?:\/.*)?$/,
  /^\/expert\/reviews(?:\/.*)?$/,
  /^\/responses$/,
  /^\/settings$/,
  /^\/chat(?:\/.*)?$/,
  /^\/archive(?:\/.*)?$/,
  /^\/support(?:\/.*)?$/,
  /^\/notifications(?:\/.*)?$/,
];

function shouldShowSidebar(pathname: string): boolean {
  return SIDEBAR_ROUTES.some((pattern) => pattern.test(pathname));
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  if (shouldShowSidebar(pathname)) {
    return <SidebarShell>{children}</SidebarShell>;
  }
  return <>{children}</>;
}
