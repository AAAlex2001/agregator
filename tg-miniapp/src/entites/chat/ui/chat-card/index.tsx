import { Card } from "@/shared/ui";
import { formatChatStamp } from "@/shared/lib/format";
import type { ChatListItem } from "../../model/types";
import s from "./style.module.scss";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

interface Props {
  chat: ChatListItem;
  onClick: (chat: ChatListItem) => void;
}

export function ChatCard({ chat, onClick }: Props) {
  const mineLast = chat.last_message_sender_id !== null && chat.last_message_sender_id !== chat.counterpart_id;
  const preview = chat.last_message_text
    ? `${mineLast ? "Вы: " : ""}${chat.last_message_text}`
    : "Файл";

  return (
    <Card className={s.card} onClick={() => onClick(chat)}>
      <span className={s.avatar}>
        {chat.counterpart_avatar_url ? (
          <img className={s.avatarImg} src={chat.counterpart_avatar_url} alt="" />
        ) : (
          initials(chat.counterpart_name)
        )}
      </span>

      <span className={s.main}>
        <span className={s.top}>
          <span className={s.name}>{chat.counterpart_name}</span>
          {chat.last_message_at && <span className={s.time}>{formatChatStamp(chat.last_message_at)}</span>}
        </span>
        <span className={s.bottom}>
          <span className={s.preview}>{preview}</span>
          {chat.unread_count > 0 && (
            <span className={s.badge}>{chat.unread_count > 99 ? "99+" : chat.unread_count}</span>
          )}
        </span>
      </span>
    </Card>
  );
}
