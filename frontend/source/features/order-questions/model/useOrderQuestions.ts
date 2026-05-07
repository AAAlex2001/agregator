"use client";

import { useEffect, useState } from "react";
import {
  answerQuestion,
  askQuestion,
  fetchQuestions,
  updateQuestion,
  type QuestionApiItem,
} from "../api/questions.api";

export function useOrderQuestions(orderId: number | null) {
  const [items, setItems] = useState<QuestionApiItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const reload = async () => {
    if (orderId === null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuestions(orderId);
      setItems(data.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void reload(); }, [orderId]);

  const ask = async (question: string, isAnonymous: boolean) => {
    if (orderId === null) return;
    setSubmitting(true);
    try {
      await askQuestion(orderId, question, isAnonymous);
      await reload();
    } finally {
      setSubmitting(false);
    }
  };

  const edit = async (questionId: number, question: string, isAnonymous?: boolean) => {
    setSubmitting(true);
    try {
      await updateQuestion(questionId, question, isAnonymous);
      await reload();
    } finally {
      setSubmitting(false);
    }
  };

  const answer = async (questionId: number, text: string) => {
    setSubmitting(true);
    try {
      await answerQuestion(questionId, text);
      await reload();
    } finally {
      setSubmitting(false);
    }
  };

  return { items, isLoading, error, isSubmitting, reload, ask, edit, answer };
}
