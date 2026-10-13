"use client";

import { RtnQuestionCardSkeleton } from "@/source/entities/rtn";
import { usePublicQuestions } from "../model/usePublicQuestions";
import { PublicQuestionCard } from "./PublicQuestionCard";
import s from "./PublicQuestionList.module.scss";

interface PublicQuestionListProps {
  basePath: string;
}

/** Вопросы, уже переданные в работу. */
export function PublicQuestionList({ basePath }: PublicQuestionListProps) {
  const questions = usePublicQuestions();

  if (!questions) {
    return (
      <div className={s.list}>
        <RtnQuestionCardSkeleton />
        <RtnQuestionCardSkeleton />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <p className={s.empty}>
        Пока нет вопросов на рассмотрении. Задайте свой — он появится здесь, как только его возьмут в работу.
      </p>
    );
  }

  return (
    <div className={s.list}>
      {questions.map((question) => (
        <PublicQuestionCard key={question.id} question={question} basePath={basePath} />
      ))}
    </div>
  );
}
