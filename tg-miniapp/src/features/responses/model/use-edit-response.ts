import { useEffect, useReducer } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { toKopecks } from "@/shared/lib/format";
import { editResponse, type ExpertResponse } from "@/entites/response";
import { initialState, reducer } from "./edit-reducer";

export function useEditResponse(response: ExpertResponse | null, onSaved: () => void) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!response) return;
    dispatch({
      type: "prefill",
      payload: {
        startDate: response.proposed_start_date_raw || "",
        deadline: response.proposed_deadline_raw || "",
        sum: response.proposed_sum_amount_raw ? String(Math.round(response.proposed_sum_amount_raw / 100)) : "",
        vat: response.vat_kind,
        comment: response.comment || "",
        keepFiles: response.response_files ?? [],
      },
    });
  }, [response]);

  const canSubmit = toKopecks(state.sum) > 0 && state.startDate !== "" && state.deadline !== "";

  const submit = async () => {
    if (!response || !canSubmit || state.busy) return;
    if (state.startDate > state.deadline) {
      emitError("Срок начала не может быть позже срока окончания");
      return;
    }
    dispatch({ type: "busy", value: true });
    try {
      await editResponse(response.id, {
        proposed_sum_amount: toKopecks(state.sum),
        proposed_start_date: state.startDate,
        proposed_deadline: state.deadline,
        vat_kind: state.vat,
        comment: state.comment.trim(),
        keep_files: state.keepFiles,
        files: state.newFiles,
      });
      notifyHaptic("success");
      onSaved();
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось сохранить отклик");
      dispatch({ type: "busy", value: false });
    }
  };

  return { state, canSubmit, submit, dispatch };
}
