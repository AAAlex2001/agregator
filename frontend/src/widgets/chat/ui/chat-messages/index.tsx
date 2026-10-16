"use client";

import { useEffect, useRef } from "react";
import { groupChatMessages, MessageGroup } from "@/entities/chat";
import type { ChatMessageData } from "@/entities/chat";
import { useUser } from "@/entities/user";
import styles from "./style.module.scss";

/** Сообщения переписки и фото собеседника. */
interface ChatMessagesProps {
  messages: ChatMessageData[];
  counterpartAvatarUrl: string | null;
}

/** Лента сообщений по отправителям; после нового сообщения прокручивается вниз. */
export function ChatMessages({ messages, counterpartAvatarUrl }: ChatMessagesProps) {
  const { user } = useUser();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;

    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={listRef}
      className={styles.thread}
    >
      <div className={styles.dateSeparator}>
        <div className={styles.datePill}>
          <span>Сегодня</span>
        </div>
      </div>
      {groupChatMessages(messages).map((group) => {
        const isMine = group.senderId === user?.id;
        const avatarUrl = isMine ? (user?.avatar_url ?? null) : counterpartAvatarUrl;

        return (
          <MessageGroup
            key={group.messages[0].id}
            group={group}
            isMine={isMine}
            avatarUrl={avatarUrl}
          />
        );
      })}
    </div>
  );
}
