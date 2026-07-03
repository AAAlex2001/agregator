import { useEffect, useState } from "react";
import { fetchOrderQuestions, type OrderQuestion } from "@/entites/order-question";
import type { Order } from "@/entites/order";

export function useArchiveOrder(order: Order | null) {
  const [questions, setQuestions] = useState<OrderQuestion[] | null>(null);

  useEffect(() => {
    if (!order) return;
    setQuestions(null);
    let active = true;
    fetchOrderQuestions(order.id)
      .then((r) => active && setQuestions(r.items))
      .catch(() => active && setQuestions([]));
    return () => {
      active = false;
    };
  }, [order]);

  return { questions };
}
