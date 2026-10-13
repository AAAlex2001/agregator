"use client";

import { useState } from "react";
import { Checkbox } from "@/source/shared/ui/Checkbox";
import { QuestionForm } from "./QuestionForm";
import s from "./AskQuestionForm.module.scss";

interface AskQuestionFormProps {
  isSubmitting: boolean;
  onAsk: (text: string, isAnonymous: boolean) => Promise<void>;
}

/** Новый вопрос исполнителя: анонимный виден только заказчику. */
export function AskQuestionForm({ isSubmitting, onAsk }: AskQuestionFormProps) {
  const [isAnonymous, setIsAnonymous] = useState(true);

  return (
    <div className={s.form}>
      <QuestionForm
        placeholder={isAnonymous ? "Задайте вопрос — его увидит только заказчик…" : "Задайте публичный вопрос — его увидят все исполнители…"}
        submitLabel="Задать вопрос"
        isSubmitting={isSubmitting}
        onSubmit={(text) => onAsk(text, isAnonymous)}
      />
      <Checkbox id="ask-question-anonymous" checked={isAnonymous} onChange={setIsAnonymous} disabled={isSubmitting}>
        <span className={s.anonText}>Задать анонимно — вопрос и ответ увидите только вы и заказчик</span>
      </Checkbox>
    </div>
  );
}
