import cn from "classnames";
import Link from "next/link";
import { formatChatListTime } from "../../model/chat-time";
import type { ChatListItemData } from "../../model/types";
import { ChatAvatar } from "../chat-avatar";
import styles from "./style.module.scss";

/** Диалог, его выделение и признак собственного последнего сообщения. */
interface ChatListItemProps {
  chat: ChatListItemData;
  isActive: boolean;
  isOwnLastMessage: boolean;
}

/** Строка диалога: собеседник, последнее сообщение, время и непрочитанные. */
export function ChatListItem({ chat, isActive, isOwnLastMessage }: ChatListItemProps) {
  return (
    <Link
      href={`/chat/${chat.uuid}`}
      className={cn(styles.item, { [styles.active]: isActive })}
      aria-current={isActive ? "page" : undefined}
    >
      <ChatAvatar
        src={chat.counterpart_avatar_url}
        alt={`Аватар ${chat.counterpart_name}`}
      />
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <span className={styles.name}>{chat.counterpart_name}</span>
          <span className={styles.time}>{formatChatListTime(chat.last_message_at)}</span>
        </div>
        <div className={styles.messageRow}>
          <span className={styles.lastMessage}>
            {isOwnLastMessage && <span className={styles.own}>Вы: </span>}
            {chat.last_message_text || "Нет сообщений"}
          </span>
          {chat.unread_count > 0 && (
            <span className={styles.unread}>{chat.unread_count}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
