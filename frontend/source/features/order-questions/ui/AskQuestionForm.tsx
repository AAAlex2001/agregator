"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { Checkbox } from "@/source/shared/ui";
import s from "./Forms.module.scss";

const MAX = 2000;

interface Props {
  isSubmitting: boolean;
  onSubmit: (text: string, isAnonymous: boolean) => Promise<void>;
}

export function AskQuestionForm({ isSubmitting, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handle = async () => {
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    await onSubmit(trimmed, isAnonymous);
    setText("");
    setIsAnonymous(true);
  };

  return (
    <div className={s.form}>
      <textarea
        className={s.textarea}
        placeholder={
          isAnonymous
            ? "Задайте вопрос — его увидит только заказчик…"
            : "Задайте публичный вопрос — его увидят все эксперты…"
        }
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX))}
        rows={3}
        disabled={isSubmitting}
      />
      <div className={s.anonRow}>
        <Checkbox
          id="ask-question-anonymous"
          checked={isAnonymous}
          onChange={(checked) => setIsAnonymous(checked)}
          disabled={isSubmitting}
        >
          <span className={s.anonText}>
            Задать анонимно — вопрос и ответ увидите только вы и заказчик
          </span>
        </Checkbox>
      </div>
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
