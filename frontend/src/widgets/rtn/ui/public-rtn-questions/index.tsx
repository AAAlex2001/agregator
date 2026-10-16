"use client";

import { RtnQuestionCardSkeleton, usePublicRtnQuestions } from "@/entities/rtn";
import { RtnQuestionDiscussion } from "../rtn-question-discussion";
import styles from "./style.module.scss";

/** Префикс ссылок публичной страницы или её версии в кабинете. */
interface PublicRtnQuestionsProps {
  basePath: string;
}

/** Показывает обращения в работе с документами сообщества и подпиской. */
export function PublicRtnQuestions({ basePath }: PublicRtnQuestionsProps) {
  const questions = usePublicRtnQuestions();

  if (!questions) {
    return (
      <div className={styles.list}>
        <RtnQuestionCardSkeleton />
        <RtnQuestionCardSkeleton />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <p className={styles.empty}>
        Пока нет вопросов на рассмотрении. Задайте свой — он появится здесь,
        как только его возьмут в работу.
      </p>
    );
  }

  return (
    <div className={styles.list}>
      {questions.map((question) => (
        <RtnQuestionDiscussion
          key={question.id}
          question={question}
          basePath={basePath}
        />
      ))}
    </div>
  );
}
