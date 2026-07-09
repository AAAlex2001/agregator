import { useEffect, useReducer } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { parseDateRu, toKopecks, toMoscowDateTimeInput } from "@/shared/lib/format";
import { deleteOrder, updateOrder, type Order } from "@/entites/order";
import { initialState, reducer } from "./reducer";

export function useEditOrder(order: Order | null, onSaved: () => void) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!order) return;
    dispatch({
      type: "prefill",
      payload: {
        title: order.title,
        sum: order.sum_amount_raw ? String(Math.round(order.sum_amount_raw / 100)) : "",
        startDate: order.start_date ? parseDateRu(order.start_date) : "",
        deadline: order.date ? parseDateRu(order.date) : "",
        responsesDeadline: order.responses_deadline ? toMoscowDateTimeInput(order.responses_deadline) : "",
        comment: order.comment || "",
        keepDocuments: {
          technical: [...order.documents.technical],
          contract: [...order.documents.contract],
          company: [...order.documents.company],
          other: [...order.documents.other],
        },
      },
    });
  }, [order]);

  const canSubmit = state.title.trim() !== "" && toKopecks(state.sum) > 0 && state.deadline !== "";

  const submit = async () => {
    if (!order || !canSubmit || state.busy) return;
    dispatch({ type: "busy", value: true });
    try {
      await updateOrder(
        order.id,
        {
          title: state.title,
          company: order.company,
          comment: state.comment,
          sumRubles: state.sum,
          startDate: state.startDate,
          deadline: state.deadline,
          responsesDeadline: state.responsesDeadline,
          badgeCodes: order.badges.map((b) => b.text),
          keepDocuments: state.keepDocuments,
          notifyResponders: state.notifyResponders,
        },
        state.newFiles,
      );
      notifyHaptic("success");
      onSaved();
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось сохранить заказ");
      dispatch({ type: "busy", value: false });
    }
  };

  const remove = async () => {
    if (!order || state.busy) return;
    dispatch({ type: "busy", value: true });
    try {
      await deleteOrder(order.id);
      notifyHaptic("success");
      onSaved();
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось удалить заказ");
      dispatch({ type: "busy", value: false });
    }
  };

  const keptUrls = [
    ...state.keepDocuments.technical,
    ...state.keepDocuments.contract,
    ...state.keepDocuments.company,
    ...state.keepDocuments.other,
  ];

  return { state, dispatch, canSubmit, submit, remove, keptUrls };
}
