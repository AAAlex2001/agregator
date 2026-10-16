"use client";

import { useUser } from "@/entities/user";
import { ChatConversationContent } from "../chat-conversation-content";
import { ChatConversationSkeleton } from "../chat-conversation-skeleton";

/** Переписка выбранного диалога; при смене аккаунта начинается заново. */
interface ChatConversationProps {
  chatUuid: string;
}

/** Ждёт профиль пользователя и показывает переписку от его имени. */
export function ChatConversation({ chatUuid }: ChatConversationProps) {
  const { user } = useUser();

  if (!user) {
    return <ChatConversationSkeleton />;
  }

  return (
    <ChatConversationContent
      key={user.id}
      chatUuid={chatUuid}
      currentUserId={user.id}
    />
  );
}
