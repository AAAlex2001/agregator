import { formatWithTime } from "@/shared/lib/format-date";
import { FileGallery } from "@/shared/ui/file-gallery";
import { toRtnGalleryItem } from "../../model/files";
import type { RtnComment } from "../../model/types";
import styles from "./style.module.scss";

/** Автор, дата, текст и вложения одного комментария РТН. */
interface RtnCommentContentProps {
  comment: RtnComment;
}

/** Показывает содержание комментария без действий над обсуждением. */
export function RtnCommentContent({ comment }: RtnCommentContentProps) {
  return (
    <>
      <div className={styles.head}>
        <span className={styles.author}>
          {comment.author.name}
          {comment.author.is_expert && (
            <span className={styles.expert}>Исполнитель</span>
          )}
        </span>
        <time
          className={styles.date}
          dateTime={comment.created_at}
        >
          {formatWithTime(comment.created_at)}
        </time>
      </div>
      <p className={styles.text}>{comment.text}</p>
      {comment.attachments.length > 0 && (
        <FileGallery items={comment.attachments.map(toRtnGalleryItem)} />
      )}
    </>
  );
}
