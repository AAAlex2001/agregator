"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/source/widgets/header";

interface AppShellProps {
  children: React.ReactNode;
}

const HEADER_ROUTES = [
  /^\/customer\/orders(?:\/.*)?$/,
  /^\/expert\/orders(?:\/.*)?$/,
  /^\/expert\/reviews(?:\/.*)?$/,
  /^\/responses$/,
  /^\/settings$/,
  /^\/chat(?:\/.*)?$/,
];

function shouldShowHeader(pathname: string): boolean {
  return HEADER_ROUTES.some((pattern) => pattern.test(pathname));
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <>
      {shouldShowHeader(pathname) ? <Header /> : null}
      {children}
    </>
  );
}