"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  LicenseHoldersPanel,
  useLicenseHoldersDrawer,
} from "@/source/widgets/license-holders-drawer";
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
  const { isAvailable } = useLicenseHoldersDrawer();
  const pathname = usePathname();
  const fullScreen = isFullScreenRoute(pathname);

  const contentClass = isAvailable ? `${s.content} ${s.contentWithRightPanel}` : s.content;
  const layoutClass = fullScreen ? `${s.layout} ${s.layoutFullScreen}` : s.layout;

  return (
    <div className={layoutClass}>
      <Sidebar />
      <main className={contentClass}>
        {!fullScreen && <LandingHeaderAuthed />}
        {children}
      </main>
      <LicenseHoldersPanel />
    </div>
  );
}
