import { useEffect, useReducer } from "react";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic } from "@/shared/services/telegram";
import { toKopecks } from "@/shared/lib/format";
import { editResponse, type ExpertResponse, type VatKind } from "@/entites/response";

interface State {
  startDate: string;
  deadline: string;
  sum: string;
  vat: VatKind;
  comment: string;
  keepFiles: string[];
  newFiles: File[];
  busy: boolean;
}

type Prefill = Pick<State, "startDate" | "deadline" | "sum" | "vat" | "comment" | "keepFiles">;

type Action =
  | { type: "prefill"; payload: Prefill }
  | { type: "startDate"; value: string }
  | { type: "deadline"; value: string }
  | { type: "sum"; value: string }
  | { type: "vat"; value: VatKind }
  | { type: "comment"; value: string }
  | { type: "removeKeep"; url: string }
  | { type: "addFiles"; files: File[] }
  | { type: "removeNew"; index: number }
  | { type: "busy"; value: boolean };

const initialState: State = {
  startDate: "",
  deadline: "",
  sum: "",
  vat: "NONE",
  comment: "",
  keepFiles: [],
  newFiles: [],
  busy: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "prefill":
      return { ...initialState, ...action.payload };
    case "startDate":
      return { ...state, startDate: action.value };
    case "deadline":
      return { ...state, deadline: action.value };
    case "sum":
      return { ...state, sum: action.value };
    case "vat":
      return { ...state, vat: action.value };
    case "comment":
      return { ...state, comment: action.value };
    case "removeKeep":
      return { ...state, keepFiles: state.keepFiles.filter((u) => u !== action.url) };
    case "addFiles":
      return { ...state, newFiles: [...state.newFiles, ...action.files] };
    case "removeNew":
      return { ...state, newFiles: state.newFiles.filter((_, i) => i !== action.index) };
    case "busy":
      return { ...state, busy: action.value };
  }
}

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
