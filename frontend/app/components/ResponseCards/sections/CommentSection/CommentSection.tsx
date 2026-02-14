"use client";

import styles from "./commentSection.module.scss";

interface CommentSectionProps {
  commentTitle: string;
  commentText: string;
}

const CommentSection = ({ commentTitle, commentText }: CommentSectionProps) => (
  <div className={styles.commentRow}>
    <span className={styles.commentTitle}>{commentTitle}</span>
    <span className={styles.commentText}>{commentText}</span>
  </div>
);

export default CommentSection;
