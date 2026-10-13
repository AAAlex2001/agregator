"use client";

import { useEffect, useReducer } from "react";
import { answerQuestion, askQuestion, fetchQuestions, updateQuestion, type OrderQuestion } from "@/source/entities/order-question";
import { useNotifications } from "@/source/shared/ui/Notifications";

interface QuestionsState {
  items: OrderQuestion[];
  isLoading: boolean;
  error: string;
  isSubmitting: boolean;
}

type QuestionsAction =
  | { type: "load/success"; items: OrderQuestion[] }
  | { type: "load/error"; error: string }
  | { type: "submit/start" }
  | { type: "submit/done" }
  | { type: "add"; item: OrderQuestion }
  | { type: "replace"; item: OrderQuestion };

function reducer(state: QuestionsState, action: QuestionsAction): QuestionsState {
  switch (action.type) {
    case "load/success":
      return { ...state, items: action.items, isLoading: false };
    case "load/error":
      return { ...state, isLoading: false, error: action.error };
    case "submit/start":
      return { ...state, isSubmitting: true };
    case "submit/done":
      return { ...state, isSubmitting: false };
    case "add":
      return { ...state, items: [...state.items, action.item] };
    case "replace":
      return { ...state, items: state.items.map((item) => (item.id === action.item.id ? action.item : item)) };
  }
}

/** Вопросы исполнителей по заказу: загрузка, свой вопрос, правка и ответ заказчика. */
export function useOrderQuestions(orderId: number) {
  const { showError } = useNotifications();
  const [state, dispatch] = useReducer(reducer, { items: [], isLoading: true, error: "", isSubmitting: false });

  useEffect(() => {
    let cancelled = false;
    fetchQuestions(orderId)
      .then((list) => {
        if (!cancelled) dispatch({ type: "load/success", items: list.items });
      })
      .catch((error) => {
        if (!cancelled) dispatch({ type: "load/error", error: error instanceof Error ? error.message : "Не удалось загрузить вопросы" });
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const run = async (request: Promise<OrderQuestion>, apply: "add" | "replace") => {
    dispatch({ type: "submit/start" });
    try {
      dispatch({ type: apply, item: await request });
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось отправить");
    } finally {
      dispatch({ type: "submit/done" });
    }
  };

  return {
    ...state,
    ask: (question: string, isAnonymous: boolean) => run(askQuestion(orderId, question, isAnonymous), "add"),
    edit: (questionId: number, question: string) => run(updateQuestion(questionId, question), "replace"),
    answer: (questionId: number, answer: string) => run(answerQuestion(questionId, answer), "replace"),
  };
}
