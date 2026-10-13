"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import { ChatSidebar } from "@/source/features/chat";
import s from "./ChatLayout.module.scss";

/** Размещает переписку слева и список диалогов справа; на телефоне показывает одну панель. */
export function ChatLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useSession();
  const hasActiveChat = pathname.startsWith("/chat/");

  return (
    <div className={s.body}>
      <section className={`${s.contentPane} ${!hasActiveChat ? s.contentPaneHiddenMobile : ""}`.trim()} aria-label="Переписка">
        {children}
      </section>
      <div className={`${s.sidebarPane} ${hasActiveChat ? s.sidebarPaneHiddenMobile : ""}`.trim()}>
        <ChatSidebar currentUserId={user?.id ?? 0} />
      </div>
    </div>
  );
}
