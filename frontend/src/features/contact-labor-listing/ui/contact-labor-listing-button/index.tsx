"use client";

import { countLaborListingUnread, useChatList } from "@/entities/chat";
import { Button } from "@/shared/ui/button";
import { useContactLaborListing } from "../../model/use-contact-labor-listing";
import styles from "./style.module.scss";

/** Объявление, на которое откликается пользователь. */
interface ContactLaborListingButtonProps {
  listingId: number;
}

/** Открывает чат с автором объявления и показывает непрочитанные в нём сообщения. */
export function ContactLaborListingButton({ listingId }: ContactLaborListingButtonProps) {
  const { chats } = useChatList();
  const { isContacting, contact } = useContactLaborListing(listingId);
  const unreadCount = countLaborListingUnread(chats, listingId);

  return (
    <Button
      variant="chat"
      size="sm"
      isLoading={isContacting}
      onClick={contact}
    >
      Откликнуться
      {unreadCount > 0 && <span className={styles.unread}>{unreadCount}</span>}
    </Button>
  );
}
