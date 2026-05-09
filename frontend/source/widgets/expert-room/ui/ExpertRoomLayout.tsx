"use client";

import type { ReactNode } from "react";
import s from "./ExpertRoomLayout.module.scss";

export function ExpertRoomLayout({ children }: { children: ReactNode }) {
  return (
    <main className={s.body}>
      <div className={s.contentPane}>{children}</div>
    </main>
  );
}
