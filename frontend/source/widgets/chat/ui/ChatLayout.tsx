"use client";

import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import { ChatListProvider, ChatSidebar } from "@/source/features/chat";
import s from "./ChatLayout.module.scss";

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useSession();
  const currentUserId = user?.id ?? 0;
  const hasActiveChat = pathname.startsWith("/chat/");

  return (
    <ChatListProvider>
      <main className={s.body}>
        <div className={`${s.sidebarPane} ${hasActiveChat ? s.sidebarPaneHiddenMobile : ""}`.trim()}>
          <ChatSidebar currentUserId={currentUserId} />
        </div>
        <div className={s.contentPane}>{children}</div>
      </main>
    </ChatListProvider>
  );
}