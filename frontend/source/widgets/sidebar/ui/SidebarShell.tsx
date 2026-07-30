"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import LandingHeaderAuthed from "@/source/widgets/landing/shared/ui/HeaderAuthed";
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
  const hideHeader = /^\/expert\/room$/.test(pathname);
  const layoutClass = fullScreen ? `${s.layout} ${s.layoutFullScreen}` : s.layout;
  const contentClass =
    fullScreen && !hideHeader ? `${s.content} ${s.contentFullScreen}` : s.content;

  return (
    <div className={layoutClass}>
      <Sidebar />
      <main className={contentClass}>
        {!hideHeader && <LandingHeaderAuthed />}
        {children}
      </main>
    </div>
  );
}
