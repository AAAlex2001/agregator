import { ChatCheckReadIcon, ChatCheckSentIcon } from "@/shared/ui/icons";
import { formatMessageTime } from "@/shared/lib/formatChatTime";
import type { ChatMessage } from "@/shared/lib/chatApi";
import styles from "./message-bubble.module.scss";

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const variant = isMine ? styles.sent : styles.received;
  const Check = message.is_read ? ChatCheckReadIcon : ChatCheckSentIcon;

  return (
    <div className={`${styles.bubble} ${variant}`}>
      {message.text && <span className={styles.text}>{message.text}</span>}
      {message.file_url && (
        <a
          href={message.file_url}
          target="_blank"
          rel="noreferrer"
          className={styles.file}
          download={message.file_name || undefined}
        >
          📎 {message.file_name || "Файл"}
        </a>
      )}
      <span className={styles.meta}>
        <span className={styles.time}>{formatMessageTime(message.created_at)}</span>
        <Check className={styles.check} />
      </span>
    </div>
  );
}
