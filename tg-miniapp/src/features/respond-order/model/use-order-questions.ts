import { useEffect, useReducer } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { fetchOrderQuestions, askOrderQuestion, type OrderQuestion } from "@/entites/order-question";

interface State {
  items: OrderQuestion[] | null;
  text: string;
  anon: boolean;
  busy: boolean;
}

type Action =
  | { type: "loaded"; items: OrderQuestion[] }
  | { type: "text"; value: string }
  | { type: "anon"; value: boolean }
  | { type: "busy"; value: boolean }
  | { type: "added"; item: OrderQuestion };

const initialState: State = { items: null, text: "", anon: true, busy: false };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "loaded":
      return { ...state, items: action.items };
    case "text":
      return { ...state, text: action.value };
    case "anon":
      return { ...state, anon: action.value };
    case "busy":
      return { ...state, busy: action.value };
    case "added":
      return { ...state, items: [action.item, ...(state.items ?? [])], text: "", busy: false };
  }
}

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
