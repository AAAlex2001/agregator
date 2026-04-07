import Link from "next/link";
import { Avatar } from "@/entities/chat/ui/Avatar";
import { formatChatListTime } from "@/shared/lib/formatChatTime";
import type { ChatListItem as ChatListItemModel } from "@/shared/lib/chatApi";
import styles from "./chat-list-item.module.scss";

interface ChatListItemProps {
  chat: ChatListItemModel;
  href: string;
}

export function ChatListItem({ chat, href }: ChatListItemProps) {
  return (
    <Link href={href} className={styles.item}>
      <Avatar src={chat.counterpart_avatar_url} alt={`Аватар ${chat.counterpart_name}`} />
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <span className={styles.name}>{chat.counterpart_name}</span>
          <span className={styles.time}>{formatChatListTime(chat.last_message_at)}</span>
        </div>
        <div className={styles.msgRow}>
          <span className={styles.lastMsg}>{chat.last_message_text || "Нет сообщений"}</span>
          {chat.unread_count > 0 && <span className={styles.unread}>{chat.unread_count}</span>}
        </div>
      </div>
    </Link>
  );
}
