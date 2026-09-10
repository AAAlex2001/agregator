"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { ListCard } from "@/source/shared/ui/ListCard";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  subscribeToRtnQuestion,
  type PublicRtnQuestion,
} from "@/source/entities/rtn-question";
import { RtnQuestionReplies } from "./RtnQuestionReplies";
import s from "./RtnPublicQuestions.module.scss";

const STATUS = {
  IN_REVIEW: { label: "В работе", color: "#1f5fbf", background: "#e8f1fd" },
  PUBLISHED: { label: "Ответ опубликован", color: "#237a43", background: "#e9f7ee" },
} as const;

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "long", year: "numeric" }).format(
    new Date(value),
  );
}

interface Props {
  question: PublicRtnQuestion;
  answerHrefPrefix: string;
}

export function RtnPublicQuestionCard({ question, answerHrefPrefix }: Props) {
  const { showError, showSuccess } = useNotifications();
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const status = question.status === "PUBLISHED" ? STATUS.PUBLISHED : STATUS.IN_REVIEW;
  const answerHref = question.answer_slug ? `${answerHrefPrefix}/rtn/${question.answer_slug}` : null;

  const subscribe = async () => {
    if (!email.trim()) return;
    setIsSubscribing(true);
    try {
      await subscribeToRtnQuestion(question.id, email.trim());
      setIsSubscribed(true);
      setSubscribeOpen(false);
      showSuccess("Пришлём письмо, когда ответ будет опубликован");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось оформить подписку");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <ListCard
      meta={`Вопрос № ${question.id}`}
      statusText={status.label}
      statusColor={status.color}
      statusBg={status.background}
      title={question.question_text}
      rightItems={[
        {
          label: "Дата обращения",
          value: <time dateTime={question.created_at}>{formatDate(question.created_at)}</time>,
        },
        {
          label: "Ответов сообщества",
          value: question.replies_count > 0 ? String(question.replies_count) : "Пока нет",
        },
      ]}
      actions={
        <div className={s.actions}>
          {answerHref && (
            <Button href={answerHref} variant="outlineOrange">
              Читать официальный ответ
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => setRepliesOpen((value) => !value)}>
            {repliesOpen ? "Скрыть ответы" : "Ответы и документы"}
          </Button>
          {question.status === "IN_REVIEW" && !isSubscribed && (
            <Button type="button" variant="outline" onClick={() => setSubscribeOpen((value) => !value)}>
              Сообщить, когда выйдет ответ
            </Button>
          )}
          {isSubscribed && <span className={s.subscribed}>Подписка оформлена</span>}
        </div>
      }
      details={
        <>
          {subscribeOpen && (
            <div className={s.subscribe}>
              <span className={s.subscribeLabel}>
                Пришлём письмо со ссылкой, как только Ростехнадзор ответит
              </span>
              <div className={s.subscribeRow}>
                <input
                  className={s.input}
                  type="email"
                  placeholder="mail@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
                <Button
                  type="button"
                  variant="primary"
                  onClick={subscribe}
                  isLoading={isSubscribing}
                >
                  Подписаться
                </Button>
              </div>
            </div>
          )}
          {repliesOpen && <RtnQuestionReplies questionId={question.id} />}
        </>
      }
    />
  );
}
