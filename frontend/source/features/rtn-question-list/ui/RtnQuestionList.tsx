"use client";

import { useEffect, useReducer } from "react";
import {
  fetchMyRtnQuestions,
  RtnQuestionCard,
  RtnQuestionCardSkeleton,
} from "@/source/entities/rtn-question";
import Button from "@/source/shared/ui/Button";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  initialRtnQuestionListState,
  rtnQuestionListReducer,
} from "../model/rtnQuestionList.reducer";
import s from "./RtnQuestionList.module.scss";

export function RtnQuestionList({ refreshKey }: { refreshKey: number }) {
  const { showError } = useNotifications();
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
          const message = loadError instanceof Error
            ? loadError.message
            : "Не удалось загрузить вопросы";
          dispatch({
            type: "error",
            message,
          });
          showError(message);
        }
      });

    return () => {
      active = false;
    };
  }, [refreshKey, retryVersion, showError]);

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
        <Button variant="outlineOrange" onClick={() => dispatch({ type: "retry" })}>
          Обновить список
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
