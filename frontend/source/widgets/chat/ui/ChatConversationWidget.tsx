"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/source/features/session";
import { ArrowIcon } from "@/source/shared/ui/icons";
import { MessageGroup, type ChatMessageData, type ChatMessageGroupData } from "@/source/entities/chat";
import { ChatBlockButton, ChatComposer, ChatOrderBanner, useChatThread } from "@/source/features/chat";
import { ChatConversationSkeleton } from "./ChatConversationSkeleton";
import s from "./ChatConversationWidget.module.scss";

interface ChatConversationWidgetProps {
  chatUuid: string;
}

function groupMessages(messages: ChatMessageData[]): ChatMessageGroupData[] {
  const groups: ChatMessageGroupData[] = [];

  for (const message of messages) {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.senderId === message.sender_id) {
      lastGroup.messages.push(message);
    } else {
      groups.push({
        senderId: message.sender_id,
        senderRole: message.sender_role,
        messages: [message],
      });
    }
  }

  return groups;
}

export function ChatConversationWidget({ chatUuid }: ChatConversationWidgetProps) {
  const router = useRouter();
  const { user } = useSession();
  const currentUserId = user?.id ?? 0;
  const { chat, messages, loading, error, threadRef, appendMessage, replaceChat } = useChatThread(chatUuid, currentUserId);
  const groups = groupMessages(messages);
  const isCustomerParty = chat ? chat.customer_id === currentUserId : false;
  const canManageChatBlock = isCustomerParty;
  const blockedText = !isCustomerParty && chat?.is_manually_blocked
    ? "Заказчик вас заблокировал."
    : undefined;

  if (loading) {
    return <ChatConversationSkeleton />;
  }

  return (
    <div className={s.card}>
      <div className={s.orderNav}>
        <div className={s.backBtnWrap}>
          <button type="button" className={s.backBtn} aria-label="Назад" onClick={() => router.push("/chat")}>
            <ArrowIcon color="currentColor" />
          </button>
        </div>

        {chat ? (
          <ChatOrderBanner
            title={chat.order_title}
            customer={chat.order_company}
            date={chat.order_date}
            sum={chat.order_sum}
            badges={chat.order_badges}
            responseStatus={chat.response_status}
          />
        ) : null}

        {canManageChatBlock && chat ? (
          <ChatBlockButton
            chatUuid={chat.uuid}
            isBlocked={chat.is_manually_blocked}
            onChanged={replaceChat}
          />
        ) : null}
      </div>

      <div className={s.thread} ref={threadRef}>
        {error ? (
          <div className={s.threadLoader}>
            <p className={s.error}>{error}</p>
          </div>
        ) : (
          <>
            <div className={s.dateSeparator}>
              <div className={s.datePill}><span>Сегодня</span></div>
            </div>
            {groups.map((group, index) => (
              <MessageGroup
                key={`${group.senderId}-${index}`}
                group={group}
                isMine={group.senderId === currentUserId}
                currentUserAvatarUrl={user?.avatar_url ?? null}
                counterpartAvatarUrl={chat?.counterpart_avatar_url}
              />
            ))}
          </>
        )}
      </div>

      {chat ? (
        <ChatComposer
          chatUuid={chat.uuid}
          isBlocked={chat.is_blocked}
          blockedText={blockedText}
          onSent={appendMessage}
        />
      ) : null}
    </div>
  );
}
