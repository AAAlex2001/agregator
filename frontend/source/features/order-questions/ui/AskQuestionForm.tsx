"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import s from "./Forms.module.scss";

const MAX = 2000;

interface Props {
  isSubmitting: boolean;
  onSubmit: (text: string) => Promise<void>;
}

export function AskQuestionForm({ isSubmitting, onSubmit }: Props) {
  const [text, setText] = useState("");

  const handle = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    await onSubmit(trimmed);
    setText("");
  };

  return (
    <div className={s.form}>
      <textarea
        className={s.textarea}
        placeholder="Задайте публичный вопрос заказчику (1 на заказ)…"
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX))}
        rows={3}
        disabled={isSubmitting}
      />
      <div className={s.controls}>
        <span className={s.counter}>{text.length}/{MAX}</span>
        <Button
          variant="primary"
          size="sm"
          onClick={handle}
          isLoading={isSubmitting}
          disabled={text.trim().length === 0}
        >
          Задать вопрос
        </Button>
      </div>
    </div>
  );
}
