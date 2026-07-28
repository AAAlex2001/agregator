"use client";

import { useEffect, useReducer } from "react";
import {
  fetchMyRtnQuestions,
  RtnQuestionCard,
  RtnQuestionCardSkeleton,
} from "@/source/entities/rtn-question";
import Button from "@/source/shared/ui/Button";
import {
  initialRtnQuestionListState,
  rtnQuestionListReducer,
} from "../model/rtnQuestionList.reducer";
import s from "./RtnQuestionList.module.scss";

export function RtnQuestionList({ refreshKey }: { refreshKey: number }) {
  const [{ questions, loading, error, retryVersion }, dispatch] = useReducer(
    rtnQuestionListReducer,
    initialRtnQuestionListState,
  );

  useEffect(() => {
    let active = true;
    dispatch({ type: "load" });

    fetchMyRtnQuestions()
      .then((items) => {
        if (active) dispatch({ type: "success", questions: items });
      })
      .catch((loadError: unknown) => {
        if (active) {
          dispatch({
            type: "error",
            message: loadError instanceof Error
              ? loadError.message
              : "Не удалось загрузить вопросы",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [refreshKey, retryVersion]);

  if (loading) {
    return (
      <div className={s.list} aria-label="Загрузка вопросов">
        <RtnQuestionCardSkeleton />
        <RtnQuestionCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.message}>
        <p>{error}</p>
        <Button variant="outlineOrange" onClick={() => dispatch({ type: "retry" })}>
          Повторить
        </Button>
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
        <RtnQuestionCard key={question.id} question={question} />
      ))}
    </div>
  );
}
