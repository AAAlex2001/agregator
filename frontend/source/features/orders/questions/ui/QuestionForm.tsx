"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import s from "./QuestionForm.module.scss";

const MAX_LENGTH = 2000;

interface QuestionFormProps {
  initial?: string;
  placeholder: string;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (text: string) => Promise<void>;
  onCancel?: () => void;
}

/** Текст вопроса или ответа со счётчиком символов. */
export function QuestionForm({ initial = "", placeholder, submitLabel, isSubmitting, onSubmit, onCancel }: QuestionFormProps) {
  const [text, setText] = useState(initial);

  const submit = async () => {
    const value = text.trim();
    if (!value) return;
    await onSubmit(value);
    setText("");
  };

  return (
    <div className={s.form}>
      <textarea
        className={s.textarea}
        placeholder={placeholder}
        value={text}
        onChange={(event) => setText(event.target.value.slice(0, MAX_LENGTH))}
        rows={3}
        disabled={isSubmitting}
      />
      <div className={s.controls}>
        <span className={s.counter}>
          {text.length}/{MAX_LENGTH}
        </span>
        {onCancel && (
          <Button variant="outline" size="sm" onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button variant="primary" size="sm" onClick={submit} isLoading={isSubmitting} disabled={text.trim().length === 0}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
