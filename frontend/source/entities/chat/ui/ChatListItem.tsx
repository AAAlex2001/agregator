import Link from "next/link";
import type { ChatListItemData } from "@/source/entities/chat";
import { ChatAvatar } from "./ChatAvatar";
import s from "./ChatListItem.module.scss";

interface ChatListItemProps {
  chat: ChatListItemData;
  href: string;
  active?: boolean;
  isOwnLastMessage?: boolean;
}

function formatChatListTime(value: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  return isToday
    ? date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    : date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
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