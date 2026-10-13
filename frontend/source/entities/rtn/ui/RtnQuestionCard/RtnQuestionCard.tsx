import { formatDateLong } from "@/source/shared/lib/formatDate";
import Button from "@/source/shared/ui/Button";
import { ListCard } from "@/source/shared/ui/ListCard";
import { rtnHref } from "../../lib/rtnHref";
import type { RtnQuestion, RtnQuestionStatus } from "../../model/question";
import s from "./RtnQuestionCard.module.scss";

const STATUS: Record<RtnQuestionStatus, { label: string; color: string; background: string; answer: string }> = {
  NEW: { label: "Передан на рассмотрение", color: "#9c5b00", background: "#fff3df", answer: "Ожидает рассмотрения" },
  IN_REVIEW: { label: "В работе", color: "#1f5fbf", background: "#e8f1fd", answer: "Готовим ответ" },
  PUBLISHED: { label: "Обработан", color: "#237a43", background: "#e9f7ee", answer: "Опубликован" },
  DISMISSED: { label: "Отклонён", color: "#8a1a1a", background: "#f7e6e6", answer: "Не опубликован" },
};

interface RtnQuestionCardProps {
  question: RtnQuestion;
  basePath: string;
}

/** Свой вопрос: статус рассмотрения, причина отказа и ссылка на опубликованный ответ. */
export function RtnQuestionCard({ question, basePath }: RtnQuestionCardProps) {
  const status = STATUS[question.status];

  return (
    <ListCard
      meta={`Вопрос № ${question.id}`}
      statusText={status.label}
      statusColor={status.color}
      statusBg={status.background}
      title={question.question_text}
      leftExtra={
        question.status === "DISMISSED" &&
        question.dismiss_reason && (
          <div className={s.reason}>
            <span className={s.reasonLabel}>Причина отклонения</span>
            <p className={s.reasonText}>{question.dismiss_reason}</p>
          </div>
        )
      }
      bottomLeftLabel="Email для ответа"
      bottomLeftValue={question.contact_email || "Не указан"}
      rightItems={[
        {
          label: "Дата отправки",
          value: <time dateTime={question.created_at}>{formatDateLong(question.created_at)}</time>,
        },
        {
          label: "Официальный ответ",
          value: question.answer_title ?? status.answer,
          valueAccent: question.status === "PUBLISHED",
        },
      ]}
      actions={
        question.answer_slug && (
          <Button href={rtnHref(basePath, question.answer_slug)} variant="outlineOrange">
            Читать официальный ответ
          </Button>
        )
      }
    />
  );
}
