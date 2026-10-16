import type { ReactNode } from "react";
import { formatDateLong } from "@/shared/lib/format-date";
import { ListCard } from "@/shared/ui/list-card";
import { RTN_QUESTION_STATUSES } from "../../config/question-statuses";
import type { PublicRtnQuestion } from "../../model/types";
import styles from "./style.module.scss";

/** Публичное обращение и действия, подключаемые виджетом обсуждения. */
interface PublicRtnQuestionCardProps {
  question: PublicRtnQuestion;
  actions: ReactNode;
  details: ReactNode;
}

/** Показывает публичный вопрос, дату и число ответов сообщества. */
export function PublicRtnQuestionCard({
  question,
  actions,
  details,
}: PublicRtnQuestionCardProps) {
  const isPublished = question.status === "PUBLISHED";
  const status = isPublished
    ? RTN_QUESTION_STATUSES.PUBLISHED
    : RTN_QUESTION_STATUSES.IN_REVIEW;

  return (
    <ListCard
      meta={`Вопрос № ${question.id}`}
      statusText={isPublished ? "Ответ опубликован" : status.label}
      statusClassName={isPublished ? styles.PUBLISHED : styles.IN_REVIEW}
      title={question.question_text}
      rightItems={[
        {
          label: "Дата обращения",
          value: (
            <time dateTime={question.created_at}>
              {formatDateLong(question.created_at)}
            </time>
          ),
        },
        {
          label: "Ответов сообщества",
          value: question.replies_count > 0
            ? String(question.replies_count)
            : "Пока нет",
        },
      ]}
      actions={actions}
      details={details}
    />
  );
}
