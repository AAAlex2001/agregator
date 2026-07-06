import { useEffect, useState } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { useSession } from "@/features/session";
import { answerOrderQuestion, fetchOrderQuestions, type OrderQuestion } from "@/entites/order-question";
import type { Order } from "@/entites/order";

export function useArchiveOrder(order: Order | null) {
  const { role } = useSession();
  const [questions, setQuestions] = useState<OrderQuestion[] | null>(null);
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [answeringId, setAnsweringId] = useState<number | null>(null);

  useEffect(() => {
    if (!order) return;
    setQuestions(null);
    setDrafts({});
    let active = true;
    fetchOrderQuestions(order.id)
      .then((r) => active && setQuestions(r.items))
      .catch(() => active && setQuestions([]));
    return () => {
      active = false;
    };
  }, [order]);

  const canAnswer = role === "CUSTOMER";

  const setDraft = (questionId: number, text: string) =>
    setDrafts((prev) => ({ ...prev, [questionId]: text }));

  const answer = async (questionId: number) => {
    const text = (drafts[questionId] ?? "").trim();
    if (!text || answeringId !== null) return;
    setAnsweringId(questionId);
    try {
      const updated = await answerOrderQuestion(questionId, text);
      setQuestions((prev) => (prev ?? []).map((q) => (q.id === questionId ? updated : q)));
      notifyHaptic("success");
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отправить ответ");
    } finally {
      setAnsweringId(null);
    }
  };

  return { questions, canAnswer, drafts, setDraft, answer, answeringId };
}
