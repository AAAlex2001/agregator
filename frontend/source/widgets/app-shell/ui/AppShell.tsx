"use client";

import { usePathname } from "next/navigation";
import { AuthHeader } from "@/source/widgets/header";

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
  /^\/archive(?:\/.*)?$/,
  /^\/support(?:\/.*)?$/,
];

function shouldShowHeader(pathname: string): boolean {
  return HEADER_ROUTES.some((pattern) => pattern.test(pathname));
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <>
      {shouldShowHeader(pathname) ? <AuthHeader /> : null}
      {children}
    </>
  );
}