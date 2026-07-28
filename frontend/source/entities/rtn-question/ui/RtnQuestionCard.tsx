import type { RtnQuestion, RtnQuestionStatus } from "../model/types";
import { ListCard } from "@/source/shared/ui/ListCard";

const STATUS: Record<RtnQuestionStatus, { label: string; color: string; background: string }> = {
  NEW: { label: "Передан на рассмотрение", color: "#9c5b00", background: "#fff3df" },
  PUBLISHED: { label: "Ответ опубликован", color: "#237a43", background: "#e9f7ee" },
  DISMISSED: { label: "Рассмотрение завершено", color: "#666d78", background: "#eef0f3" },
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
    <ListCard
      meta={`Вопрос № ${question.id}`}
      statusText={status.label}
      statusColor={status.color}
      statusBg={status.background}
      title={question.question_text}
      bottomLeftLabel="Дата отправки"
      bottomLeftValue={
        <time dateTime={question.created_at}>{formatDate(question.created_at)}</time>
      }
    />
  );
}
