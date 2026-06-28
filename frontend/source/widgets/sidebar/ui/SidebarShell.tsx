"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LicenseHoldersPanel } from "@/source/widgets/license-holders-drawer";
import LandingHeaderAuthed from "@/source/widgets/landing/ui/HeaderAuthed";
import { Sidebar } from "./Sidebar";
import s from "./SidebarShell.module.scss";

interface SidebarShellProps {
  children: ReactNode;
}

const FULLSCREEN_ROUTES = [
  /^\/chat(?:\/.*)?$/,
  /^\/expert\/room$/,
  /^\/support(?:\/.*)?$/,
];

function isFullScreenRoute(pathname: string): boolean {
  return FULLSCREEN_ROUTES.some((pattern) => pattern.test(pathname));
}

export function SidebarShell({ children }: SidebarShellProps) {
  const pathname = usePathname();
  const fullScreen = isFullScreenRoute(pathname);
  const layoutClass = fullScreen ? `${s.layout} ${s.layoutFullScreen}` : s.layout;

  return (
    <div className={layoutClass}>
      <Sidebar />
      <main className={s.content}>
        {!fullScreen && <LandingHeaderAuthed />}
        {children}
      </main>
      <LicenseHoldersPanel />
    </div>
  );
}
