import cn from "classnames";
import { QUESTION_STATUS_LABELS, QUESTION_STATUS_TONES, type Question } from "@/entities/question";
import { SITE_URL } from "@/shared/api";
import { rtnFromQuestionPath } from "@/shared/lib/admin-paths";
import { formatDateTime } from "@/shared/lib/date";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import IconButton from "@/shared/ui/icon-button";
import { TrashIcon } from "@/shared/ui/icons";
import List from "@/shared/ui/list";
import ListRow from "@/shared/ui/list-row";
import styles from "./style.module.scss";

type QuestionsTableProps = {
  questions: Question[];
  pendingId: number | null;
  onTakeInReview: (question: Question) => void;
  onDismiss: (question: Question) => void;
  onRemove: (question: Question) => void;
};

/** Список вопросов посетителей с действиями модерации в каждой строке. */
const QuestionsTable = ({ questions, pendingId, onTakeInReview, onDismiss, onRemove }: QuestionsTableProps) => (
  <List>
    {questions.map((question) => (
      <ListRow key={question.id} className={cn(styles.row, pendingId === question.id && styles.pending)}>
        <div className={styles.head}>
          <span className={styles.meta}>
            #{question.id} · {formatDateTime(question.created_at)}
            {question.contact_email && ` · ${question.contact_email}`}
          </span>
          <Badge tone={QUESTION_STATUS_TONES[question.status]}>{QUESTION_STATUS_LABELS[question.status]}</Badge>
        </div>

        <p className={styles.text}>{question.question_text}</p>

        {question.answer_slug && (
          <p className={styles.note}>
            Ответ:{" "}
            <a href={`${SITE_URL}/rtn/${question.answer_slug}`} target="_blank" rel="noopener noreferrer">
              {question.answer_title || question.answer_slug}
            </a>
          </p>
        )}

        {question.status === "DISMISSED" && question.dismiss_reason && (
          <p className={styles.note}>Причина отклонения: {question.dismiss_reason}</p>
        )}

        {question.status !== "PUBLISHED" && (
          <div className={styles.actions}>
            <Button size="sm" href={rtnFromQuestionPath(question.id)}>
              Создать разъяснение
            </Button>
            {question.status === "NEW" && (
              <Button variant="outline" size="sm" onClick={() => onTakeInReview(question)}>
                В работу
              </Button>
            )}
            {question.status !== "DISMISSED" && (
              <Button variant="ghost" size="sm" onClick={() => onDismiss(question)}>
                Отклонить
              </Button>
            )}
            <IconButton tone="danger" size="sm" ariaLabel="Удалить вопрос" className={styles.remove} onClick={() => onRemove(question)}>
              <TrashIcon />
            </IconButton>
          </div>
        )}
      </ListRow>
    ))}
  </List>
);

export default QuestionsTable;
