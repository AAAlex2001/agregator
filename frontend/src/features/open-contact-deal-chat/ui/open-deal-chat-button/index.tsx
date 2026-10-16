"use client";

import { countDealUnread, useChatList } from "@/entities/chat";
import { Button } from "@/shared/ui/button";
import { useOpenContactDealChat } from "../../model/use-open-contact-deal-chat";
import styles from "./style.module.scss";

/** Сделка, по которой открывается переписка, и оформление кнопки в строке. */
interface OpenDealChatButtonProps {
  dealId: number;
  className?: string;
}

/** Открывает чат сделки и показывает число непрочитанных сообщений. */
export function OpenDealChatButton({ dealId, className }: OpenDealChatButtonProps) {
  const { chats } = useChatList();
  const { isOpening, openChat } = useOpenContactDealChat(dealId);
  const unread = countDealUnread(chats, dealId);

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      isLoading={isOpening}
      onClick={openChat}
    >
      Открыть чат
      {unread > 0 && (
        <span className={styles.unread}>{unread > 99 ? "99+" : unread}</span>
      )}
    </Button>
  );
}
