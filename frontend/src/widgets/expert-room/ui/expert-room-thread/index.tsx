"use client";

import { useEffect, useRef } from "react";
import { ExpertRoomMessageGroup, groupExpertRoomMessages } from "@/entities/expert-room";
import type { ExpertRoomMessage } from "@/entities/expert-room";
import { useUser } from "@/entities/user";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { TabChatIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Расстояние до низа ленты, при котором новые сообщения прокручивают её вниз. */
const STICK_TO_BOTTOM_PX = 60;

/** Сообщения, состояние их догрузки и число коллег, набирающих текст. */
interface ExpertRoomThreadProps {
  messages: ExpertRoomMessage[];
  error: string | null;
  hasMore: boolean;
  isLoadingOlder: boolean;
  olderError: string | null;
  typingCount: number;
  onLoadOlder: () => Promise<void>;
}

/**
 * Лента сообщений: внизу держится, пока пользователь не прокрутил вверх, и после
 * своего сообщения; у верхнего края догружает историю, сохраняя позицию прокрутки.
 */
export function ExpertRoomThread({
  messages,
  error,
  hasMore,
  isLoadingOlder,
  olderError,
  typingCount,
  onLoadOlder,
}: ExpertRoomThreadProps) {
  const { user } = useUser();
  const threadRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const lastMessageIdRef = useRef<number | null>(null);
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingOlder,
    onLoadMore: loadOlder,
    rootMargin: "100px",
  });

  useEffect(() => {
    const thread = threadRef.current;
    const lastMessage = messages.at(-1);
    const isNewOwnMessage = lastMessage !== undefined
      && lastMessage.id !== lastMessageIdRef.current
      && lastMessage.sender_id === user?.id;

    lastMessageIdRef.current = lastMessage?.id ?? null;

    if (thread && (isAtBottomRef.current || isNewOwnMessage)) {
      thread.scrollTop = thread.scrollHeight;
    }
  }, [messages, typingCount, user?.id]);

  /** Догружает старые сообщения и оставляет на экране те, что пользователь читал. */
  async function loadOlder() {
    const previousHeight = threadRef.current?.scrollHeight ?? 0;

    await onLoadOlder();

    requestAnimationFrame(() => {
      const thread = threadRef.current;

      if (thread) {
        thread.scrollTop = thread.scrollHeight - previousHeight;
      }
    });
  }

  /** Запоминает, находится ли пользователь у последних сообщений. */
  function trackScroll() {
    const thread = threadRef.current;

    if (thread) {
      const distance = thread.scrollHeight - thread.scrollTop - thread.clientHeight;

      isAtBottomRef.current = distance < STICK_TO_BOTTOM_PX;
    }
  }

  return (
    <div
      ref={threadRef}
      className={styles.thread}
      onScroll={trackScroll}
    >
      <div
        ref={sentinelRef}
        aria-hidden="true"
      />
      {isLoadingOlder && <div className={styles.status}>Загружаем старые сообщения…</div>}
      {olderError && <div className={styles.status}>{olderError}</div>}
      {error && messages.length === 0 && (
        <div className={styles.errorBlock}>
          <p className={styles.error}>{error}</p>
        </div>
      )}
      {!error && messages.length === 0 && (
        <EmptyState
          icon={<TabChatIcon />}
          title="Сообщений пока нет"
          subtitle="Начните разговор с коллегами."
        />
      )}
      {groupExpertRoomMessages(messages).map((group) => {
        const isMine = group.senderId === user?.id;
        const avatarUrl = isMine ? (user?.avatar_url ?? null) : group.senderAvatarUrl;

        return (
          <ExpertRoomMessageGroup
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
