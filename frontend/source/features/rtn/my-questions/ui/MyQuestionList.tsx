"use client";

import { RtnQuestionCard, RtnQuestionCardSkeleton } from "@/source/entities/rtn";
import Button from "@/source/shared/ui/Button";
import { useMyQuestions } from "../model/useMyQuestions";
import s from "./MyQuestionList.module.scss";

interface MyQuestionListProps {
  basePath: string;
  onRetry: () => void;
}

/** «Ваши вопросы» со статусом рассмотрения. */
export function MyQuestionList({ basePath, onRetry }: MyQuestionListProps) {
  const { questions, error } = useMyQuestions();

  if (error) {
    return (
      <div className={s.message}>
        <p>{error}</p>
        <Button variant="outlineOrange" onClick={onRetry}>
          Обновить список
        </Button>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className={s.list} aria-label="Загрузка вопросов">
        <RtnQuestionCardSkeleton />
        <RtnQuestionCardSkeleton />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className={s.message}>
        <h3>Вы ещё не задавали вопросов</h3>
        <p>После отправки вопрос появится здесь вместе с текущим статусом рассмотрения.</p>
      </div>
    );
  }

  return (
    <div className={s.list}>
      {questions.map((question) => (
        <RtnQuestionCard key={question.id} question={question} basePath={basePath} />
      ))}
    </div>
  );
}
