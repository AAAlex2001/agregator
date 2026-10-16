"use client";

import { QuestionForm } from "@/entities/order-question";
import type { OrderQuestion } from "@/entities/order-question";
import { useEditQuestionForm } from "../../model/use-edit-question-form";

/** Вопрос автора и завершение его редактирования. */
interface EditOrderQuestionFormProps {
  question: OrderQuestion;
  onSaved: () => void;
  onCancel: () => void;
}

/** Редактирует вопрос, на который заказчик ещё не ответил. */
export function EditOrderQuestionForm({
  question,
  onSaved,
  onCancel,
}: EditOrderQuestionFormProps) {
  const form = useEditQuestionForm(question, onSaved);

  return (
    <QuestionForm
      text={form.text}
      placeholder="Ваш вопрос"
      submitLabel="Сохранить"
      isSubmitting={form.isSubmitting}
      onTextChange={form.changeText}
      onSubmit={form.submit}
      onCancel={onCancel}
    />
  );
}
