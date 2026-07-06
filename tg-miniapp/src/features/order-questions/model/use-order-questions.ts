import { useEffect, useReducer } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { fetchOrderQuestions, askOrderQuestion } from "@/entites/order-question";
import { initialState, reducer } from "./reducer";

export function useOrderQuestions(orderId: number) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let active = true;
    fetchOrderQuestions(orderId)
      .then((r) => active && dispatch({ type: "loaded", items: r.items }))
      .catch(() => active && dispatch({ type: "loaded", items: [] }));
    return () => {
      active = false;
    };
  }, [orderId]);

  const ask = async () => {
    const question = state.text.trim();
    if (!question || state.busy) return;
    dispatch({ type: "busy", value: true });
    try {
      const created = await askOrderQuestion(orderId, question, state.anon);
      dispatch({ type: "added", item: created });
      notifyHaptic("success");
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отправить вопрос");
      dispatch({ type: "busy", value: false });
    }
  };

  return { state, dispatch, ask };
}
