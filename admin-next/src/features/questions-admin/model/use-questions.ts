"use client";

import { useEffect, useReducer } from "react";
import type { Question } from "@/entities/question";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { deleteQuestion, fetchQuestions, setQuestionStatus } from "../api/questions";
import { questionsReducer } from "./reducers";

/** Очередь вопросов посетителей: фильтр по статусу, взятие в работу, отклонение с причиной, удаление. */
export const useQuestions = () => {
  const toast = useToast();
  const [state, dispatch] = useReducer(questionsReducer, {
    filter: "",
    items: null,
    loading: true,
    failed: false,
    pendingId: null,
    dismissing: null,
    dismissReason: "",
    removing: null,
  });
  const { filter } = state;

  useEffect(() => {
    let active = true;

    fetchQuestions(filter)
      .then((list) => {
        if (active) dispatch({ type: "load/success", items: list.items });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [filter]);

  const request = async (id: number, action: () => Promise<void>, fallback: string) => {
    dispatch({ type: "request/start", id });

    try {
      await action();
    } catch (failure) {
      toast(errorMessage(failure, fallback), "error");
    } finally {
      dispatch({ type: "request/finish" });
    }
  };

  const changeFilter = (value: string) => dispatch({ type: "load/start", filter: value });

  const takeInReview = (question: Question) =>
    request(
      question.id,
      async () => {
        dispatch({ type: "question/changed", question: await setQuestionStatus(question.id, "IN_REVIEW") });
        toast("Вопрос взят в работу");
      },
      "Не удалось изменить статус",
    );

  const openDismiss = (question: Question) => dispatch({ type: "dismiss/open", question });
  const changeDismissReason = (value: string) => dispatch({ type: "dismiss/change", value });
  const closeDismiss = () => dispatch({ type: "dismiss/close" });

  const dismiss = () => {
    const question = state.dismissing;
    const reason = state.dismissReason.trim();

    if (!question || !reason) return;

    request(
      question.id,
      async () => {
        dispatch({ type: "question/changed", question: await setQuestionStatus(question.id, "DISMISSED", reason) });
        toast("Вопрос отклонён");
      },
      "Не удалось отклонить вопрос",
    );
  };

  const askRemove = (question: Question) => dispatch({ type: "remove/ask", question });
  const cancelRemove = () => dispatch({ type: "remove/cancel" });

  const remove = () => {
    const question = state.removing;

    if (!question) return;

    request(
      question.id,
      async () => {
        await deleteQuestion(question.id);
        dispatch({ type: "question/removed", id: question.id });
        toast("Вопрос удалён");
      },
      "Не удалось удалить вопрос",
    );
  };

  return {
    state,
    changeFilter,
    takeInReview,
    openDismiss,
    changeDismissReason,
    closeDismiss,
    dismiss,
    askRemove,
    cancelRemove,
    remove,
  };
};
