import cn from "classnames";
import { resolveFileUrl } from "@/shared/lib/file-url";
import { formatWithTime } from "@/shared/lib/format-date";
import { FileGallery } from "@/shared/ui/file-gallery";
import type { TicketMessage as TicketMessageData } from "../../model/types";
import styles from "./style.module.scss";

/** Сообщение переписки; showHead показывает автора у первого сообщения серии. */
interface TicketMessageProps {
  message: TicketMessageData;
  showHead: boolean;
}

/** Сообщение пользователя справа, поддержки — слева, с приложенными файлами. */
export function TicketMessage({ message, showHead }: TicketMessageProps) {
  const isUser = message.author === "user";
  const defaultAuthor = isUser ? "Вы" : "Поддержка";
  const attachments = message.attachments.map((attachment) => ({
    id: attachment.url,
    name: attachment.name,
    url: resolveFileUrl(attachment.url),
  }));

  return (
    <div
      className={cn(isUser ? styles.user : styles.support, {
        [styles.continued]: !showHead,
      })}
    >
      {showHead && (
        <div className={styles.head}>
          <span className={styles.author}>{message.author_name || defaultAuthor}</span>
          <span className={styles.date}>{formatWithTime(message.created_at)}</span>
        </div>
      )}
      <div className={styles.bubble}>
        {message.text && <p className={styles.text}>{message.text}</p>}
        {attachments.length > 0 && (
          <FileGallery
            items={attachments}
            hideWhenEmpty
            blockClassName={styles.gallery}
          />
        )}
      </div>
    </div>
  );
}
