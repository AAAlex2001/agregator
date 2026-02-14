import styles from "./commentSection.module.scss";

interface CommentSectionProps {
  comment: string;
}

export default function CommentSection({ comment }: CommentSectionProps) {
  return (
    <div className={styles.commentArea}>
      <div className={styles.commentTitle}>Комментарий к заказу</div>
      <div className={styles.commentBox}>
        <p className={styles.commentText}>{comment || "Комментарий отсутствует"}</p>
      </div>
    </div>
  );
}
