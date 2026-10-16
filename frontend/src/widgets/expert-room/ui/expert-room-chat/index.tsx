"use client";

import { TypingIndicator, useExpertRoomThread } from "@/entities/expert-room";
import { ExpertRoomComposer } from "@/features/send-expert-room-message";
import { ExpertRoomSkeleton } from "../expert-room-skeleton";
import { ExpertRoomThread } from "../expert-room-thread";
import { RulesBanner } from "../rules-banner";
import styles from "./style.module.scss";

/** Пользователь, от имени которого открыт чат. */
interface ExpertRoomChatProps {
  currentUserId: number;
}

/** Чат исполнителей: правила, лента, кто печатает и поле нового сообщения. */
export function ExpertRoomChat({ currentUserId }: ExpertRoomChatProps) {
  const thread = useExpertRoomThread(currentUserId);
  const blockedText = thread.banReason
    ? `Вы заблокированы в чате исполнителей. ${thread.banReason}`
    : "Вы заблокированы в чате исполнителей";

  if (thread.isLoading) {
    return <ExpertRoomSkeleton />;
  }

  return (
    <div className={styles.card}>
      <RulesBanner />
      <ExpertRoomThread
        messages={thread.messages}
        error={thread.error}
        hasMore={thread.hasMore}
        isLoadingOlder={thread.isLoadingOlder}
        olderError={thread.olderError}
        typingCount={thread.typingUsers.length}
        onLoadOlder={thread.loadOlder}
      />
      <TypingIndicator users={thread.typingUsers} />
      <ExpertRoomComposer
        isBlocked={thread.isForbidden}
        blockedText={blockedText}
        onSent={thread.appendMessage}
        onTyping={thread.notifyTyping}
      />
    </div>
  );
}
