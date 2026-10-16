"use client";

import { QuestionForm } from "@/entities/order-question";
import type { OrderQuestion } from "@/entities/order-question";
import { useAnswerQuestionForm } from "../../model/use-answer-question-form";

/** Вопрос исполнителя и завершение ввода ответа заказчика. */
interface AnswerOrderQuestionFormProps {
  question: OrderQuestion;
  onSaved: () => void;
  onCancel?: () => void;
}

/** Отвечает на вопрос с подсказкой о публичности ответа. */
export function AnswerOrderQuestionForm({
  question,
  onSaved,
  onCancel,
}: AnswerOrderQuestionFormProps) {
  const form = useAnswerQuestionForm(question, onSaved);
  const placeholder = question.is_anonymous
    ? "Ваш ответ (виден только этому исполнителю)…"
    : "Ваш ответ (виден всем исполнителям)…";

  return (
    <QuestionForm
      text={form.text}
      placeholder={placeholder}
      submitLabel={question.answer === null ? "Ответить" : "Сохранить"}
      isSubmitting={form.isSubmitting}
      onTextChange={form.changeText}
      onSubmit={form.submit}
      onCancel={onCancel}
    />
  );
}
