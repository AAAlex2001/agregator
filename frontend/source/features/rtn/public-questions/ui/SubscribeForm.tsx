"use client";

import Button from "@/source/shared/ui/Button";
import { useSubscribe } from "../model/useSubscribe";
import s from "./SubscribeForm.module.scss";

interface SubscribeFormProps {
  questionId: number;
  onSubscribed: () => void;
}

/** Почта для письма со ссылкой на официальный ответ. */
export function SubscribeForm({ questionId, onSubscribed }: SubscribeFormProps) {
  const { email, setEmail, isSending, subscribe } = useSubscribe(questionId, onSubscribed);

  return (
    <div className={s.subscribe}>
      <span className={s.label}>Пришлём письмо со ссылкой, как только Ростехнадзор ответит</span>
      <div className={s.row}>
        <input
          className={s.input}
          type="email"
          placeholder="mail@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Button type="button" variant="primary" onClick={subscribe} isLoading={isSending}>
          Подписаться
        </Button>
      </div>
    </div>
  );
}
