import type { ReactNode } from "react";
import LandingHeaderAuthed from "@/source/widgets/landing/shared/ui/HeaderAuthed";
import { Sidebar } from "./Sidebar";
import s from "./SidebarShell.module.scss";

interface SidebarShellProps {
  children: ReactNode;
}

export function SidebarShell({ children }: SidebarShellProps) {
  return (
    <div className={s.layout}>
      <LandingHeaderAuthed />
      <div className={s.body}>
        <Sidebar />
        <main className={s.content}>{children}</main>
      </div>
    </div>
  );
}
