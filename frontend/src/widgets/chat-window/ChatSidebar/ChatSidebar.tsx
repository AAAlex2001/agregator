"use client";

import Link from "next/link";
import { useState } from "react";
import { ChatSearchInput } from "@/shared/ui/ChatSearchInput";
import { Avatar } from "@/entities/chat/ui/Avatar";
import { formatChatListTime } from "@/shared/lib/formatChatTime";
import { filterChats } from "@/features/chat/use-chat-list";
import type { ChatListItem } from "@/shared/lib/chatApi";
import styles from "./chat-sidebar.module.scss";

interface ChatSidebarProps {
  chats: ChatListItem[];
  activeUuid: string | null;
  currentUserId: number;
  routeBase: string;
}

export function ChatSidebar({ chats, activeUuid, currentUserId, routeBase }: ChatSidebarProps) {
  const [search, setSearch] = useState("");
  const filtered = filterChats(chats, search);

  return (
    <aside className={styles.sidebar}>
      <ChatSearchInput value={search} onChange={setSearch} placeholder="Поиск по чатам" />
      <div className={styles.list}>
        {filtered.map((item) => {
          const isActive = item.uuid === activeUuid;
          const isMine = item.last_message_sender_id === currentUserId;
          return (
            <Link
              key={item.id}
              href={`${routeBase}/${item.uuid}`}
              className={`${styles.item} ${isActive ? styles.active : ""}`}
            >
              <Avatar src={item.counterpart_avatar_url} alt={`Аватар ${item.counterpart_name}`} />
              <div className={styles.content}>
                <div className={styles.titleRow}>
                  <span className={styles.name}>{item.counterpart_name}</span>
                  <span className={styles.time}>{formatChatListTime(item.last_message_at)}</span>
                </div>
                <div className={styles.msgRow}>
                  <span className={styles.msg}>
                    {isMine && <span className={styles.prefix}>Вы: </span>}
                    {item.last_message_text || "Нет сообщений"}
                  </span>
                  {item.unread_count > 0 && <span className={styles.unread}>{item.unread_count}</span>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
