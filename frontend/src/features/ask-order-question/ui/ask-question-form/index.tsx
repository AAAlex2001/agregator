"use client";

import { useId } from "react";
import { QuestionForm } from "@/entities/order-question";
import { Checkbox } from "@/shared/ui/checkbox";
import { useAskQuestionForm } from "../../model/use-ask-question-form";
import styles from "./style.module.scss";

/** Позволяет исполнителю задать публичный или анонимный вопрос по заказу. */
export function AskOrderQuestionForm() {
  const checkboxId = useId();
  const form = useAskQuestionForm();
  const placeholder = form.isAnonymous
    ? "Задайте вопрос — его увидит только заказчик…"
    : "Задайте публичный вопрос — его увидят все исполнители…";

  return (
    <div className={styles.form}>
      <QuestionForm
        text={form.text}
        placeholder={placeholder}
        submitLabel="Задать вопрос"
        isSubmitting={form.isSubmitting}
        onTextChange={form.changeText}
        onSubmit={form.submit}
      />
      <Checkbox
        id={checkboxId}
        checked={form.isAnonymous}
        onChange={form.changeAnonymity}
        disabled={form.isSubmitting}
      >
        <span className={styles.anonText}>
          Задать анонимно — вопрос и ответ увидите только вы и заказчик
        </span>
      </Checkbox>
    </div>
  );
}
