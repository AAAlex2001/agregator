import cn from "classnames";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { FileGallery } from "@/shared/ui/file-gallery";
import { ChatCheckReadIcon } from "@/shared/ui/icons";
import type { ExpertRoomMessage as Message } from "../../model/types";
import styles from "./style.module.scss";

/** Сообщение и сторона чата, с которой оно показано. */
interface ExpertRoomMessageProps {
  message: Message;
  isMine: boolean;
}

/** Облако сообщения: текст, вложения, время отправки и отметка доставки. */
export function ExpertRoomMessage({ message, isMine }: ExpertRoomMessageProps) {
  const time = new Date(message.created_at).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const files = message.attachments.map((attachment) => ({
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
        <span className={styles.time}>{time}</span>
        <ChatCheckReadIcon className={styles.check} />
      </span>
    </div>
  );
}
