import cn from "classnames";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import { ChatCheckReadIcon, ChatCheckSentIcon } from "@/shared/ui/icons";
import { formatMessageTime } from "../../model/chat-time";
import { getMessageAttachments } from "../../model/messages";
import type { ChatMessageData } from "../../model/types";
import styles from "./style.module.scss";

/** Сообщение и сторона переписки, с которой оно показано. */
interface MessageBubbleProps {
  message: ChatMessageData;
  isMine: boolean;
}

/** Облако сообщения: текст, вложения, время и отметка о прочтении. */
export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const files = getMessageAttachments(message).map((attachment) => ({
    id: `${message.id}-${attachment.url}`,
    name: attachment.name,
    url: resolveFileUrl(attachment.url),
  }));

  return (
    <div className={cn(styles.bubble, isMine ? styles.sent : styles.received)}>
      <div className={styles.content}>
        {message.text && <span className={styles.text}>{message.text}</span>}
        {files.length > 0 && (
          <FileGallery
            items={files}
            blockClassName={styles.gallery}
            gridProps={{ className: styles.galleryGrid }}
          />
        )}
      </div>
      <span className={styles.meta}>
        <span className={styles.time}>{formatMessageTime(message.created_at)}</span>
        {message.is_read ? (
          <ChatCheckReadIcon className={styles.check} />
        ) : (
          <ChatCheckSentIcon className={styles.check} />
        )}
      </span>
    </div>
  );
}
