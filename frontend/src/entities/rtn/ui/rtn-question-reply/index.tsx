import { formatDateLong } from "@/shared/lib/format-date";
import { FileGallery } from "@/shared/ui/file-gallery";
import { toRtnGalleryItem } from "../../model/files";
import type { RtnQuestionReply } from "../../model/types";
import styles from "./style.module.scss";

/** Опубликованный документ ведомства и пояснение пользователя. */
interface RtnQuestionReplyProps {
  reply: RtnQuestionReply;
}

/** Показывает автора ответа, дату, текст и приложенные документы. */
export function RtnQuestionReplyContent({ reply }: RtnQuestionReplyProps) {
  return (
    <li className={styles.reply}>
      <div className={styles.head}>
        <span className={styles.author}>{reply.author_name}</span>
        <time
          className={styles.date}
          dateTime={reply.created_at}
        >
          {formatDateLong(reply.created_at)}
        </time>
      </div>
      {reply.text && <p className={styles.text}>{reply.text}</p>}
      <FileGallery items={reply.attachments.map(toRtnGalleryItem)} />
    </li>
  );
}
