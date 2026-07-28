import type { RtnQuestion, RtnQuestionStatus } from "../model/types";
import s from "./RtnQuestionCard.module.scss";

const STATUS: Record<RtnQuestionStatus, { label: string; className: string }> = {
  NEW: { label: "Передан на рассмотрение", className: s.statusNew },
  PUBLISHED: { label: "Ответ опубликован", className: s.statusPublished },
  DISMISSED: { label: "Рассмотрение завершено", className: s.statusDismissed },
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function RtnQuestionCard({ question }: { question: RtnQuestion }) {
  const status = STATUS[question.status];

  return (
    <article className={s.card}>
      <div className={s.main}>
        <span className={s.number}>Вопрос № {question.id}</span>
        <p className={s.text}>{question.question_text}</p>
        <time className={s.date} dateTime={question.created_at}>
          {formatDate(question.created_at)}
        </time>
      </div>
      <span className={`${s.status} ${status.className}`}>{status.label}</span>
    </article>
  );
}
