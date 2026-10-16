"use client";

import cn from "classnames";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ChatSidebar } from "../chat-sidebar";
import styles from "./style.module.scss";

/** Открытая переписка или подсказка выбрать диалог. */
interface ChatLayoutProps {
  children: ReactNode;
}

/** Переписка слева и список диалогов справа; на телефоне видна одна из панелей. */
export function ChatLayout({ children }: ChatLayoutProps) {
  const pathname = usePathname();
  const hasActiveChat = pathname.startsWith("/chat/");

  return (
    <div className={styles.body}>
      <section
        className={cn(styles.contentPane, { [styles.hiddenOnMobile]: !hasActiveChat })}
        aria-label="Переписка"
      >
        {children}
      </section>
      <div className={cn(styles.sidebarPane, { [styles.hiddenOnMobile]: hasActiveChat })}>
        <ChatSidebar />
      </div>
    </div>
  );
}
