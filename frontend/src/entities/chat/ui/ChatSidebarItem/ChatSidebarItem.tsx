import Link from "next/link";
import { Avatar } from "@/entities/chat/ui/Avatar";
import { formatChatListTime } from "@/shared/lib/formatChatTime";
import type { ChatListItem as ChatListItemModel } from "@/shared/lib/chatApi";
import styles from "./chat-sidebar-item.module.scss";

interface ChatSidebarItemProps {
  chat: ChatListItemModel;
  href: string;
  isActive: boolean;
  isMine: boolean;
}

export function ChatSidebarItem({ chat, href, isActive, isMine }: ChatSidebarItemProps) {
  const className = `${styles.item} ${isActive ? styles.active : ""}`;

  return (
    <Link href={href} className={className}>
      <Avatar src={chat.counterpart_avatar_url} alt={`Аватар ${chat.counterpart_name}`} />
      <div className={styles.content}>
        <div className={styles.titleRow}>
          <span className={styles.name}>{chat.counterpart_name}</span>
          <span className={styles.time}>{formatChatListTime(chat.last_message_at)}</span>
        </div>
        <div className={styles.msgRow}>
          <span className={styles.msg}>
            {isMine ? "Вы: " : ""}
            {chat.last_message_text || "Нет сообщений"}
          </span>
          {chat.unread_count > 0 && <span className={styles.unread}>{chat.unread_count}</span>}
        </div>
      </div>
    </Link>
  );
}
