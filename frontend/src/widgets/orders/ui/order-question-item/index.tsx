"use client";

import { useState } from "react";
import { QuestionCard } from "@/entities/order-question";
import type { OrderQuestion } from "@/entities/order-question";
import { AnswerOrderQuestionForm } from "@/features/answer-order-question";
import { EditOrderQuestionForm } from "@/features/edit-order-question";

/** Вопрос и доступные текущему пользователю действия. */
interface OrderQuestionItemProps {
  question: OrderQuestion;
  isOwner: boolean;
  canAnswer: boolean;
}

/** Собирает карточку вопроса и одну открытую форму редактирования. */
export function OrderQuestionItem({
  question,
  isOwner,
  canAnswer,
}: OrderQuestionItemProps) {
  const [editing, setEditing] = useState<"question" | "answer" | null>(null);
  const canEditQuestion = isOwner && question.answer === null && editing === null;
  const showAnswerForm = canAnswer && (question.answer === null || editing === "answer");

  /** Открывает редактирование текста вопроса. */
  function editQuestion() {
    setEditing("question");
  }

  /** Открывает редактирование сохранённого ответа. */
  function editAnswer() {
    setEditing("answer");
  }

  /** Возвращает карточку к сохранённому тексту. */
  function closeEditor() {
    setEditing(null);
  }

  return (
    <QuestionCard
      question={question}
      onEditQuestion={canEditQuestion ? editQuestion : undefined}
      onEditAnswer={canAnswer ? editAnswer : undefined}
      questionForm={editing === "question" ? (
        <EditOrderQuestionForm
          question={question}
          onSaved={closeEditor}
          onCancel={closeEditor}
        />
      ) : undefined}
      answerForm={showAnswerForm ? (
        <AnswerOrderQuestionForm
          question={question}
          onSaved={closeEditor}
          onCancel={editing === "answer" ? closeEditor : undefined}
        />
      ) : undefined}
    />
  );
}
