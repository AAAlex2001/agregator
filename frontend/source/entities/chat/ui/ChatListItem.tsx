import Link from "next/link";
import type { ChatListItemData } from "@/source/entities/chat";
import { formatChatListTime } from "@/source/shared/lib/formatDate";
import { ChatAvatar } from "./ChatAvatar";
import s from "./ChatListItem.module.scss";

interface ChatListItemProps {
  chat: ChatListItemData;
  href: string;
  active?: boolean;
  isOwnLastMessage?: boolean;
}

export function ChatListItem({ chat, href, active = false, isOwnLastMessage = false }: ChatListItemProps) {
  return (
    <Link href={href} className={`${s.item} ${active ? s.active : ""}`.trim()}>
      <ChatAvatar src={chat.counterpart_avatar_url} alt={`Аватар ${chat.counterpart_name}`} />
      <div className={s.content}>
        <div className={s.titleRow}>
          <span className={s.name}>{chat.counterpart_name}</span>
          <span className={s.time}>{formatChatListTime(chat.last_message_at)}</span>
        </div>
        <div className={s.msgRow}>
          <span className={s.lastMsg}>
            {isOwnLastMessage ? <span className={s.own}>Вы: </span> : null}
            {chat.last_message_text || "Нет сообщений"}
          </span>
          {chat.unread_count > 0 ? <span className={s.unread}>{chat.unread_count}</span> : null}
        </div>
      </div>
    </Link>
  );
}