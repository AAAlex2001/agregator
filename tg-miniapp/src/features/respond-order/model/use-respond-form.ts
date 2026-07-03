import { useEffect, useReducer } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { toKopecks } from "@/shared/lib/format";
import type { Order } from "@/entites/order";
import { createOrderResponse } from "./api";
import { initialState, reducer } from "./reducer";

export function useRespondForm(order: Order | null) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (order) dispatch({ type: "reset" });
  }, [order]);

  const needsCompany = order?.requires_license ?? false;
  const companyOk = !needsCompany || Boolean(state.party && state.party.data.inn);
  const canSubmit =
    toKopecks(state.sum) > 0 && state.startDate !== "" && state.deadline !== "" && companyOk;

  const submit = async () => {
    if (!order || !canSubmit || state.busy) return;
    if (state.startDate > state.deadline) {
      emitError("Срок начала не может быть позже срока окончания");
      return;
    }
    dispatch({ type: "busy", value: true });
    try {
      await createOrderResponse(order.id, {
        proposed_sum_amount: toKopecks(state.sum),
        proposed_start_date: state.startDate,
        proposed_deadline: state.deadline,
        vat_kind: state.vat,
        comment: state.comment.trim(),
        expert_inn: needsCompany ? state.party?.data.inn ?? undefined : undefined,
        expert_company_data: needsCompany && state.party ? JSON.stringify(state.party) : undefined,
        files: state.files,
      });
      notifyHaptic("success");
      dispatch({ type: "done" });
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось откликнуться");
      dispatch({ type: "busy", value: false });
    }
  };

  return { state, needsCompany, canSubmit, submit, dispatch };
}
