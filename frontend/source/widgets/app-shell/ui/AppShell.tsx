"use client";

import { usePathname } from "next/navigation";
import { SidebarShell } from "@/source/widgets/sidebar";
import LandingHeaderAuthed from "@/source/widgets/landing/ui/HeaderAuthed";

interface AppShellProps {
  children: React.ReactNode;
}

const SIDEBAR_ROUTES = [
  /^\/landing(?:\/.*)?$/,
  /^\/customer\/orders(?:\/.*)?$/,
  /^\/customer\/reports(?:\/.*)?$/,
  /^\/expert\/orders(?:\/.*)?$/,
  /^\/expert\/reviews(?:\/.*)?$/,
  /^\/expert\/hazard(?:\/.*)?$/,
  /^\/expert\/lining(?:\/.*)?$/,
  /^\/license-holders(?:\/.*)?$/,
  /^\/expert\/room$/,
  /^\/expert-reviews(?:\/.*)?$/,
  /^\/experts\/[^/]+\/orders$/,
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
  return (
    <>
      <LandingHeaderAuthed />
      {children}
    </>
  );
}
