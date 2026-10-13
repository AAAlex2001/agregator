"use client";

import { useState } from "react";
import { rtnHref, type PublicRtnQuestion } from "@/source/entities/rtn";
import { formatDateLong } from "@/source/shared/lib/formatDate";
import Button from "@/source/shared/ui/Button";
import { ListCard } from "@/source/shared/ui/ListCard";
import { QuestionReplies } from "./QuestionReplies";
import { SubscribeForm } from "./SubscribeForm";
import s from "./PublicQuestionCard.module.scss";

const PUBLISHED = { label: "Ответ опубликован", color: "#237a43", background: "#e9f7ee" };
const IN_REVIEW = { label: "В работе", color: "#1f5fbf", background: "#e8f1fd" };

type Panel = "replies" | "subscribe" | null;

interface PublicQuestionCardProps {
  question: PublicRtnQuestion;
  basePath: string;
}

/** Вопрос на рассмотрении: ссылка на ответ, ответы сообщества и подписка на публикацию. */
export function PublicQuestionCard({ question, basePath }: PublicQuestionCardProps) {
  const [panel, setPanel] = useState<Panel>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const status = question.status === "PUBLISHED" ? PUBLISHED : IN_REVIEW;
  const togglePanel = (next: Panel) => setPanel(panel === next ? null : next);

  return (
    <ListCard
      meta={`Вопрос № ${question.id}`}
      statusText={status.label}
      statusColor={status.color}
      statusBg={status.background}
      title={question.question_text}
      rightItems={[
        { label: "Дата обращения", value: <time dateTime={question.created_at}>{formatDateLong(question.created_at)}</time> },
        { label: "Ответов сообщества", value: question.replies_count > 0 ? String(question.replies_count) : "Пока нет" },
      ]}
      actions={
        <div className={s.actions}>
          {question.answer_slug && (
            <Button href={rtnHref(basePath, question.answer_slug)} variant="outlineOrange">
              Читать официальный ответ
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => togglePanel("replies")}>
            {panel === "replies" ? "Скрыть ответы" : "Ответы и документы"}
          </Button>
          {question.status === "IN_REVIEW" && !isSubscribed && (
            <Button type="button" variant="outline" onClick={() => togglePanel("subscribe")}>
              Сообщить, когда выйдет ответ
            </Button>
          )}
          {isSubscribed && <span className={s.subscribed}>Подписка оформлена</span>}
        </div>
      }
      details={
        <>
          {panel === "subscribe" && (
            <SubscribeForm
              questionId={question.id}
              onSubscribed={() => {
                setIsSubscribed(true);
                setPanel(null);
              }}
            />
          )}
          {panel === "replies" && <QuestionReplies questionId={question.id} />}
        </>
      }
    />
  );
}
