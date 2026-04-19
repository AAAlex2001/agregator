import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { ChatCheckReadIcon, ChatCheckSentIcon } from "@/source/shared/ui/icons";
import type { ChatMessageData } from "@/source/entities/chat";
import s from "./MessageBubble.module.scss";

interface MessageBubbleProps {
  message: ChatMessageData;
  isMine: boolean;
}

function formatMessageTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const CheckIcon = message.is_read ? ChatCheckReadIcon : ChatCheckSentIcon;
  const fileUrl = message.file_url ? resolveFileUrl(message.file_url) : null;

  return (
    <div className={`${s.bubble} ${isMine ? s.sent : s.received}`.trim()}>
      {message.text ? <span className={s.text}>{message.text}</span> : null}
      {fileUrl ? (
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className={s.file}
          download={message.file_name || undefined}
        >
          📎 {message.file_name || "Файл"}
        </a>
      ) : null}
      <span className={s.meta}>
        <span className={s.time}>{formatMessageTime(message.created_at)}</span>
        <CheckIcon className={s.check} />
      </span>
    </div>
  );
}