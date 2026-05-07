"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import s from "./SidebarShell.module.scss";

interface SidebarShellProps {
  children: ReactNode;
}

export function SidebarShell({ children }: SidebarShellProps) {
  return (
    <div className={s.layout}>
      <Sidebar />
      <main className={s.content}>{children}</main>
    </div>
  );
}
