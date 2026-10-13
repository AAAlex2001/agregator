"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChatListItem } from "@/source/entities/chat";
import { Title } from "@/source/shared/ui/Typography";
import { EmptyState } from "@/source/shared/ui/EmptyState";
import { TabChatIcon } from "@/source/shared/ui/icons";
import Button from "@/source/shared/ui/Button";
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
  const { chats, loading, error, refresh } = useChatListContext();

  const activeChatUuid = pathname.startsWith("/chat/") ? pathname.slice(6) : null;
  const query = search.trim().toLowerCase();
  const filteredChats = query
    ? chats.filter((chat) =>
        chat.counterpart_name.toLowerCase().includes(query)
        || chat.last_message_text.toLowerCase().includes(query),
      )
    : chats;

  return (
    <aside className={s.sidebar} aria-label="Список диалогов" aria-busy={loading}>
      <Title text="Сообщения" as="h1" className={s.title} />
      <ChatSearchInput value={search} onChange={setSearch} placeholder="Поиск по сообщениям" />

      <div className={s.list}>
        {loading ? (
          <ChatSidebarSkeleton />
        ) : error && chats.length === 0 ? (
          <div className={s.status}>
            <p role="alert">{error}</p>
            <Button variant="outlineOrange" size="sm" onClick={() => void refresh()}>Повторить</Button>
          </div>
        ) : filteredChats.length === 0 ? (
          <EmptyState
            icon={<TabChatIcon />}
            title={query ? "Диалоги не найдены" : "Сообщений пока нет"}
            subtitle={query ? "Попробуйте изменить запрос." : "Здесь появятся ваши диалоги."}
          />
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