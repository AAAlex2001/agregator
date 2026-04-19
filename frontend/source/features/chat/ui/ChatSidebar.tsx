"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatListItem } from "@/source/entities/chat";
import { ChatSearchInput } from "@/source/shared/ui/ChatSearchInput";
import { useChatListContext } from "../model/chatListContext";
import { ChatSidebarSkeleton } from "./ChatSidebarSkeleton";
import s from "./ChatSidebar.module.scss";

interface ChatSidebarProps {
  currentUserId: number;
}

export function ChatSidebar({ currentUserId }: ChatSidebarProps) {
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const { chats, loading, error } = useChatListContext();

  const activeChatUuid = pathname.startsWith("/chat/") ? pathname.slice(6) : null;
  const query = search.trim().toLowerCase();
  const filteredChats = query
    ? chats.filter((chat) => chat.counterpart_name.toLowerCase().includes(query))
    : chats;

  return (
    <aside className={s.sidebar}>
      <ChatSearchInput value={search} onChange={setSearch} placeholder="Поиск по чатам" />

      <div className={s.list}>
        {loading ? (
          <ChatSidebarSkeleton />
        ) : error ? (
          <p className={s.status}>{error}</p>
        ) : filteredChats.length === 0 ? (
          <p className={s.status}>Нет чатов</p>
        ) : (
          filteredChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              href={`/chat/${chat.uuid}`}
              active={chat.uuid === activeChatUuid}
              isOwnLastMessage={chat.last_message_sender_id === currentUserId}
            />
          ))
        )}
      </div>
    </aside>
  );
}