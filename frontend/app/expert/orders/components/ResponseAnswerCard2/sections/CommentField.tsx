import styles from "./sections.module.scss";

interface CommentFieldProps {
  comment: string;
  onCommentChange: (value: string) => void;
}

export default function CommentField({ comment, onCommentChange }: CommentFieldProps) {
  return (
    <div className={styles.commentSection}>
      <div className={styles.commentTitle}>Комментарий для заказчика</div>
      <textarea
        className={styles.commentTextarea}
        value={comment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Напишите комментарий для заказчика..."
        maxLength={5000}
      />
    </div>
  );
}
