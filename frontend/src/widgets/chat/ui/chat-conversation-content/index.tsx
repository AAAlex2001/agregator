"use client";

import Link from "next/link";
import { ChatOrderBanner, useChatThread } from "@/entities/chat";
import { BlockChatButton } from "@/features/block-chat";
import { ChatComposer } from "@/features/send-chat-message";
import { ArrowIcon } from "@/shared/ui/icons";
import { ChatConversationSkeleton } from "../chat-conversation-skeleton";
import { ChatMessages } from "../chat-messages";
import styles from "./style.module.scss";

/** Открытая переписка и текущий пользователь. */
interface ChatConversationContentProps {
  chatUuid: string;
  currentUserId: number;
}

/** Шапка заказа, сообщения и поле ввода; блокировать чат может только заказчик. */
export function ChatConversationContent({
  chatUuid,
  currentUserId,
}: ChatConversationContentProps) {
  const thread = useChatThread(chatUuid, currentUserId);
  const chat = thread.chat;

  if (thread.isLoading) {
    return <ChatConversationSkeleton />;
  }

  const isCustomer = chat?.customer_id === currentUserId;
  const blockedText = !isCustomer && chat?.is_manually_blocked
    ? "Заказчик вас заблокировал."
    : "Чат по этому заказу завершен";

  return (
    <div className={styles.card}>
      <div className={styles.orderNav}>
        <div className={styles.backButtonWrap}>
          <Link
            href="/chat"
            className={styles.backButton}
            aria-label="Назад"
          >
            <ArrowIcon />
          </Link>
        </div>
        {chat && <ChatOrderBanner chat={chat} />}
        {chat && isCustomer && (
          <BlockChatButton
            chat={chat}
            onChanged={thread.replaceChat}
          />
        )}
      </div>

      {thread.readError && <p className={styles.error}>{thread.readError}</p>}

      {chat ? (
        <ChatMessages
          messages={thread.messages}
          counterpartAvatarUrl={chat.counterpart_avatar_url}
        />
      ) : (
        <div className={styles.errorBox}>
          <p className={styles.error}>{thread.error}</p>
        </div>
      )}

      {chat && (
        <ChatComposer
          chatUuid={chat.uuid}
          isBlocked={chat.is_blocked}
          blockedText={blockedText}
          onSent={thread.appendMessage}
        />
      )}
    </div>
  );
}
