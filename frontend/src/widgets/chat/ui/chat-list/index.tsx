"use client";

import { usePathname } from "next/navigation";
import {
  ChatListItem,
  ChatListItemSkeleton,
  filterChats,
  useChatList,
} from "@/entities/chat";
import { useUser } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/ui/empty-state";
import { TabChatIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Текст поиска по диалогам. */
interface ChatListProps {
  query: string;
}

/** Диалоги с выделением открытого; пока список грузится — заглушки строк. */
export function ChatList({ query }: ChatListProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const { chats, isLoading, error, refresh } = useChatList();
  const foundChats = filterChats(chats, query);
  const isSearching = query.trim() !== "";

  if (isLoading) {
    return (
      <div className={styles.list}>
        <div
          className={styles.skeleton}
          aria-hidden="true"
        >
          <ChatListItemSkeleton />
          <ChatListItemSkeleton />
          <ChatListItemSkeleton />
          <ChatListItemSkeleton />
          <ChatListItemSkeleton />
          <ChatListItemSkeleton />
        </div>
      </div>
    );
  }

  if (error && chats.length === 0) {
    return (
      <div className={styles.list}>
        <div className={styles.status}>
          <p role="alert">{error}</p>
          <Button
            variant="outlineOrange"
            size="sm"
            onClick={refresh}
          >
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  if (foundChats.length === 0) {
    const emptyTitle = isSearching ? "Диалоги не найдены" : "Сообщений пока нет";
    const emptyText = isSearching
      ? "Попробуйте изменить запрос."
      : "Здесь появятся ваши диалоги.";

    return (
      <div className={styles.list}>
        <EmptyState
          icon={<TabChatIcon />}
          title={emptyTitle}
          subtitle={emptyText}
        />
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {foundChats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isActive={pathname === `/chat/${chat.uuid}`}
          isOwnLastMessage={chat.last_message_sender_id === user?.id}
        />
      ))}
    </div>
  );
}
