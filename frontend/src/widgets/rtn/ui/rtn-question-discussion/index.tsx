"use client";

import { useState } from "react";
import { PublicRtnQuestionCard } from "@/entities/rtn";
import type { PublicRtnQuestion } from "@/entities/rtn";
import { RtnQuestionSubscription } from "@/features/subscribe-to-rtn-question";
import { Button } from "@/shared/ui/button";
import { RtnQuestionReplies } from "../rtn-question-replies";
import styles from "./style.module.scss";

/** Открытая часть карточки публичного обращения. */
type QuestionPanel = "replies" | "subscribe" | null;

/** Публичное обращение и префикс ссылок на официальные разъяснения. */
interface RtnQuestionDiscussionProps {
  question: PublicRtnQuestion;
  basePath: string;
}

/** Подключает к карточке документы сообщества и подписку на официальный ответ. */
export function RtnQuestionDiscussion({
  question,
  basePath,
}: RtnQuestionDiscussionProps) {
  const [panel, setPanel] = useState<QuestionPanel>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  /** Открывает или скрывает ответы сообщества. */
  function toggleReplies() {
    setPanel(panel === "replies" ? null : "replies");
  }

  /** Открывает или скрывает поле почты для уведомления. */
  function toggleSubscription() {
    setPanel(panel === "subscribe" ? null : "subscribe");
  }

  /** Показывает подтверждение подписки и закрывает поле почты. */
  function finishSubscription() {
    setIsSubscribed(true);
    setPanel(null);
  }

  return (
    <PublicRtnQuestionCard
      question={question}
      actions={
        <div className={styles.actions}>
          {question.answer_slug && (
            <Button
              href={`${basePath}/rtn/${question.answer_slug}`}
              variant="outlineOrange"
            >
              Читать официальный ответ
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={toggleReplies}
          >
            {panel === "replies" ? "Скрыть ответы" : "Ответы и документы"}
          </Button>
          {question.status === "IN_REVIEW" && !isSubscribed && (
            <Button
              type="button"
              variant="outline"
              onClick={toggleSubscription}
            >
              Сообщить, когда выйдет ответ
            </Button>
          )}
          {isSubscribed && (
            <span className={styles.subscribed}>Подписка оформлена</span>
          )}
        </div>
      }
      details={
        <>
          {panel === "subscribe" && (
            <RtnQuestionSubscription
              questionId={question.id}
              onSubscribed={finishSubscription}
            />
          )}
          {panel === "replies" && (
            <RtnQuestionReplies
              key={question.id}
              questionId={question.id}
            />
          )}
        </>
      }
    />
  );
}
