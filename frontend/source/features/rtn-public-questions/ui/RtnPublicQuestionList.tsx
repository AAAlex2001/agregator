"use client";

import { useEffect, useState } from "react";
import { fetchPublicRtnQuestions, type PublicRtnQuestion } from "@/source/entities/rtn-question";
import { RtnQuestionCardSkeleton } from "@/source/entities/rtn-question";
import { RtnPublicQuestionCard } from "./RtnPublicQuestionCard";
import s from "./RtnPublicQuestions.module.scss";

interface Props {
  refreshKey?: number;
  answerHrefPrefix?: string;
}

export function RtnPublicQuestionList({ refreshKey = 0, answerHrefPrefix = "" }: Props) {
  const [questions, setQuestions] = useState<PublicRtnQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchPublicRtnQuestions()
      .then(setQuestions)
      .catch(() => setQuestions([]))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  if (isLoading) {
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
        <RtnPublicQuestionCard
          key={question.id}
          question={question}
          answerHrefPrefix={answerHrefPrefix}
        />
      ))}
    </div>
  );
}
