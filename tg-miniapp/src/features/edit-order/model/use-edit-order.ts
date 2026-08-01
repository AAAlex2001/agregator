import { useEffect, useReducer } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { parseDateRu, toKopecks, toMoscowDateTimeInput } from "@/shared/lib/format";
import { deleteOrder, updateOrder, type Order } from "@/entites/order";
import { initialState, reducer } from "./reducer";

export function useEditOrder(order: Order | null, onSaved: () => void, template: Order | null = null) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!order) return;
    const source = template ?? order;
    dispatch({
      type: "prefill",
      payload: {
        title: source.title,
        sum: source.sum_amount_raw ? String(Math.round(source.sum_amount_raw / 100)) : "",
        startDate: source.start_date ? parseDateRu(source.start_date) : "",
        deadline: source.date ? parseDateRu(source.date) : "",
        responsesDeadline: source.responses_deadline ? toMoscowDateTimeInput(source.responses_deadline) : "",
        comment: source.comment || "",
        keepDocuments: {
          technical: [...source.documents.technical],
          contract: [...source.documents.contract],
          company: [...source.documents.company],
          other: [...source.documents.other],
        },
        copySourceOrderId: template?.id ?? null,
      },
    });
  }, [order, template]);

  const canSubmit = state.title.trim() !== "" && toKopecks(state.sum) > 0 && state.deadline !== "";

  const submit = async () => {
    if (!order || !canSubmit || state.busy) return;
    dispatch({ type: "busy", value: true });
    try {
      const source = template ?? order;
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
          badgeCodes: source.badges.map((b) => b.text),
          keepDocuments: state.keepDocuments,
          notifyResponders: state.notifyResponders,
          copySourceOrderId: state.copySourceOrderId,
          requiresExpert: source.requires_expert,
          requiresLicense: source.requires_license,
          workType: source.work_type ?? "EXPERTISE",
          details: source.details ?? undefined,
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
