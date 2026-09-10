"use client";

import { usePathname } from "next/navigation";
import type { RtnQuestion, RtnQuestionStatus } from "../model/types";
import Button from "@/source/shared/ui/Button";
import { ListCard } from "@/source/shared/ui/ListCard";
import s from "./RtnQuestionCard.module.scss";

const STATUS: Record<RtnQuestionStatus, { label: string; color: string; background: string }> = {
  NEW: { label: "Передан на рассмотрение", color: "#9c5b00", background: "#fff3df" },
  IN_REVIEW: { label: "В работе", color: "#1f5fbf", background: "#e8f1fd" },
  PUBLISHED: { label: "Обработан", color: "#237a43", background: "#e9f7ee" },
  DISMISSED: { label: "Отклонён", color: "#8a1a1a", background: "#f7e6e6" },
};

const ANSWER_LABEL: Record<RtnQuestionStatus, string> = {
  NEW: "Ожидает рассмотрения",
  IN_REVIEW: "Готовим ответ",
  PUBLISHED: "Опубликован",
  DISMISSED: "Не опубликован",
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
  const pathname = usePathname();
  const answerHref = question.answer_slug
    ? `${pathname.startsWith("/landing") ? "/landing" : ""}/rtn/${question.answer_slug}`
    : null;

  return (
    <ListCard
      meta={`Вопрос № ${question.id}`}
      statusText={status.label}
      statusColor={status.color}
      statusBg={status.background}
      title={question.question_text}
      leftExtra={
        question.status === "DISMISSED" && question.dismiss_reason ? (
          <div className={s.reason}>
            <span className={s.reasonLabel}>Причина отклонения</span>
            <p className={s.reasonText}>{question.dismiss_reason}</p>
          </div>
        ) : null
      }
      bottomLeftLabel="Email для ответа"
      bottomLeftValue={question.contact_email || "Не указан"}
      rightItems={[
        {
          label: "Дата отправки",
          value: (
            <time dateTime={question.created_at}>
              {formatDate(question.created_at)}
            </time>
          ),
        },
        {
          label: "Официальный ответ",
          value: question.answer_title ?? ANSWER_LABEL[question.status],
          valueAccent: question.status === "PUBLISHED",
        },
      ]}
      actions={answerHref && (
        <Button href={answerHref} variant="outlineOrange">
          Читать официальный ответ
        </Button>
      )}
    />
  );
}
