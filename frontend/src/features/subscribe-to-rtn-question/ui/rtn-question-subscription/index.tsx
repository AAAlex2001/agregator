"use client";

import type { ChangeEvent } from "react";
import { Button } from "@/shared/ui/button";
import { useSubscribeToRtnQuestion } from "../../model/use-subscribe-to-rtn-question";
import styles from "./style.module.scss";

/** Обращение и действие после успешного оформления подписки. */
interface RtnQuestionSubscriptionProps {
  questionId: number;
  onSubscribed: () => void;
}

/** Показывает поле почты для получения официального ответа. */
export function RtnQuestionSubscription({
  questionId,
  onSubscribed,
}: RtnQuestionSubscriptionProps) {
  const { email, setEmail, isSending, subscribe } = useSubscribeToRtnQuestion(
    questionId,
    onSubscribed,
  );

  /** Обновляет адрес для уведомления. */
  function changeEmail(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }

  return (
    <div className={styles.subscribe}>
      <span className={styles.label}>
        Пришлём письмо со ссылкой, как только Ростехнадзор ответит
      </span>
      <div className={styles.row}>
        <input
          className={styles.input}
          type="email"
          placeholder="mail@example.com"
          value={email}
          onChange={changeEmail}
        />
        <Button
          type="button"
          variant="primary"
          onClick={subscribe}
          isLoading={isSending}
        >
          Подписаться
        </Button>
      </div>
    </div>
  );
}
