import { formatDateLong } from "@/shared/lib/format-date";
import { Button } from "@/shared/ui/button";
import { ListCard } from "@/shared/ui/list-card";
import { RTN_QUESTION_STATUSES } from "../../config/question-statuses";
import type { RtnQuestion } from "../../model/types";
import styles from "./style.module.scss";

/** Своё обращение и префикс ссылки на опубликованное разъяснение. */
interface RtnQuestionCardProps {
  question: RtnQuestion;
  basePath: string;
}

/** Показывает статус обращения, причину отказа и ссылку на официальный ответ. */
export function RtnQuestionCard({ question, basePath }: RtnQuestionCardProps) {
  const status = RTN_QUESTION_STATUSES[question.status];

  return (
    <ListCard
      meta={`Вопрос № ${question.id}`}
      statusText={status.label}
      statusClassName={styles[question.status]}
      title={question.question_text}
      leftExtra={
        question.status === "DISMISSED" && question.dismiss_reason && (
          <div className={styles.reason}>
            <span className={styles.reasonLabel}>Причина отклонения</span>
            <p className={styles.reasonText}>{question.dismiss_reason}</p>
          </div>
        )
      }
      bottomLeftLabel="Email для ответа"
      bottomLeftValue={question.contact_email || "Не указан"}
      rightItems={[
        {
          label: "Дата отправки",
          value: (
            <time dateTime={question.created_at}>
              {formatDateLong(question.created_at)}
            </time>
          ),
        },
        {
          label: "Официальный ответ",
          value: question.answer_title ?? status.answer,
          valueAccent: question.status === "PUBLISHED",
        },
      ]}
      actions={
        question.answer_slug && (
          <Button
            href={`${basePath}/rtn/${question.answer_slug}`}
            variant="outlineOrange"
          >
            Читать официальный ответ
          </Button>
        )
      }
    />
  );
}
