import type { ReactNode } from "react";
import { formatWithTime } from "@/shared/lib/format-date";
import { UserAvatar } from "@/shared/ui/user-avatar";
import type { OrderQuestion } from "../../model/types";
import styles from "./style.module.scss";

/** Вопрос с ответом и местами для форм редактирования. */
interface QuestionCardProps {
  question: OrderQuestion;
  questionForm?: ReactNode;
  answerForm?: ReactNode;
  onEditQuestion?: () => void;
  onEditAnswer?: () => void;
}

/** Показывает автора, видимость вопроса и сохранённый ответ заказчика. */
export function QuestionCard({
  question,
  questionForm,
  answerForm,
  onEditQuestion,
  onEditAnswer,
}: QuestionCardProps) {
  return (
    <article className={styles.card}>
      <header className={styles.head}>
        <UserAvatar
          src={question.expert_avatar_url}
          alt={question.expert_name}
          className={styles.avatar}
        />
        <div className={styles.headText}>
          <span className={styles.name}>
            {question.expert_name || "Исполнитель"}
          </span>
          <span className={styles.date}>
            {formatWithTime(question.asked_at)}
          </span>
        </div>
        {question.is_anonymous && (
          <span
            className={styles.anonBadge}
            title="Видят только вы и заказчик"
          >
            Анонимно
          </span>
        )}
      </header>

      {questionForm || <p className={styles.text}>{question.question}</p>}

      {onEditQuestion && (
        <button
          type="button"
          className={styles.linkBtn}
          onClick={onEditQuestion}
        >
          Изменить
        </button>
      )}

      {question.answer !== null && !answerForm && (
        <div className={styles.answer}>
          <span className={styles.answerLabel}>Ответ заказчика:</span>
          <p className={styles.text}>{question.answer}</p>
          {onEditAnswer && (
            <button
              type="button"
              className={styles.linkBtn}
              onClick={onEditAnswer}
            >
              Изменить ответ
            </button>
          )}
        </div>
      )}

      {answerForm}
    </article>
  );
}
