"use client";

import cn from "classnames";
import type { RtnComment } from "@/entities/rtn";
import { useReactToRtnComment } from "../../model/use-react-to-rtn-comment";
import styles from "./style.module.scss";

/** Комментарий со счётчиками и отметкой текущего участника. */
interface RtnCommentReactionsProps {
  comment: RtnComment;
}

/** Показывает три отметки обсуждения и подсвечивает выбранную. */
export function RtnCommentReactions({ comment }: RtnCommentReactionsProps) {
  const { markUseful, requestClarification, agree } = useReactToRtnComment(comment.id);

  return (
    <div className={styles.row}>
      <button
        type="button"
        className={cn(styles.button, {
          [styles.active]: comment.my_reaction === "USEFUL",
        })}
        onClick={markUseful}
      >
        Полезно
        <span className={styles.count}>{comment.useful_count}</span>
      </button>
      <button
        type="button"
        className={cn(styles.button, {
          [styles.active]: comment.my_reaction === "CLARIFICATION",
        })}
        onClick={requestClarification}
      >
        Есть уточнение
        <span className={styles.count}>{comment.clarification_count}</span>
      </button>
      <button
        type="button"
        className={cn(styles.button, {
          [styles.active]: comment.my_reaction === "AGREE",
        })}
        onClick={agree}
      >
        Согласен с практикой
        <span className={styles.count}>{comment.agree_count}</span>
      </button>
    </div>
  );
}
