import { useEffect, useReducer } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { createExpertReview } from "@/entites/review";
import { initialState, reducer } from "./reducer";

export function useLeaveReview(responseId: number | null, open: boolean, onDone: () => void) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (open) dispatch({ type: "reset" });
  }, [open]);

  const canSubmit = state.rating >= 1 && !state.busy;

  const submit = async () => {
    if (responseId === null || !canSubmit) return;
    dispatch({ type: "busy", value: true });
    try {
      await createExpertReview({ response_id: responseId, rating: state.rating, comment: state.comment.trim() });
      notifyHaptic("success");
      onDone();
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось отправить отзыв");
      dispatch({ type: "busy", value: false });
    }
  };

  return { state, dispatch, canSubmit, submit };
}
