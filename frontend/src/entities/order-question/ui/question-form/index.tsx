"use client";

import type { ChangeEvent } from "react";
import { Button } from "@/shared/ui/button";
import { QUESTION_MAX_LENGTH } from "../../config/limits";
import styles from "./style.module.scss";

/** Поля вопроса или ответа; отправкой и черновиком управляет отдельная фича. */
interface QuestionFormProps {
  text: string;
  placeholder: string;
  submitLabel: string;
  isSubmitting: boolean;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
}

/** Показывает текст, ограничение длины и кнопки отправки вопроса или ответа. */
export function QuestionForm({
  text,
  placeholder,
  submitLabel,
  isSubmitting,
  onTextChange,
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  /** Ограничивает длину вопроса или ответа перед сохранением черновика. */
  function changeText(event: ChangeEvent<HTMLTextAreaElement>) {
    onTextChange(event.target.value.slice(0, QUESTION_MAX_LENGTH));
  }

  return (
    <div className={styles.form}>
      <textarea
        className={styles.textarea}
        placeholder={placeholder}
        value={text}
        onChange={changeText}
        rows={3}
        disabled={isSubmitting}
      />
      <div className={styles.controls}>
        <span className={styles.counter}>
          {text.length}/{QUESTION_MAX_LENGTH}
        </span>
        {onCancel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            Отмена
          </Button>
        )}
        <Button
          variant="primary"
          size="sm"
          onClick={onSubmit}
          isLoading={isSubmitting}
          disabled={text.trim().length === 0}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
