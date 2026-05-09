"use client";

import type { ReactNode } from "react";
import {
  LicenseHoldersPanel,
  useLicenseHoldersDrawer,
} from "@/source/widgets/license-holders-drawer";
import { Sidebar } from "./Sidebar";
import s from "./SidebarShell.module.scss";

interface SidebarShellProps {
  children: ReactNode;
}

export function SidebarShell({ children }: SidebarShellProps) {
  const { isAvailable } = useLicenseHoldersDrawer();
  const contentClass = isAvailable ? `${s.content} ${s.contentWithRightPanel}` : s.content;

  return (
    <div className={s.layout}>
      <Sidebar />
      <main className={contentClass}>{children}</main>
      <LicenseHoldersPanel />
    </div>
  );
}
