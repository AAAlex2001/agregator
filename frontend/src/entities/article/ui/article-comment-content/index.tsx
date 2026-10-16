import { formatWithTime } from "@/shared/lib/format-date";
import type { ArticleComment } from "../../model/types";
import styles from "./style.module.scss";

/** Комментарий статьи с автором, датой и текстом. */
interface ArticleCommentContentProps {
  comment: ArticleComment;
}

/** Показывает автора и текст комментария, сохраняя переносы строк. */
export function ArticleCommentContent({ comment }: ArticleCommentContentProps) {
  return (
    <>
      <div className={styles.head}>
        <span className={styles.author}>
          {comment.author_name}
        </span>
        <time
          className={styles.date}
          dateTime={comment.created_at}
        >
          {formatWithTime(comment.created_at)}
        </time>
      </div>
      <p className={styles.text}>
        {comment.text}
      </p>
    </>
  );
}
