import type { ResponseItem } from "@/entities/response";
import type { EditResponseAction, EditResponseState } from "./types";

/** Заполняет черновик сохранёнными условиями и файлами отклика. */
export function createEditResponseState(response: ResponseItem): EditResponseState {
  return {
    startDate: response.proposed_start_date_raw,
    deadline: response.proposed_deadline_raw,
    cost: response.proposed_sum_amount_raw > 0
      ? String(response.proposed_sum_amount_raw / 100)
      : "",
    vatKind: response.vat_kind,
    comment: response.comment,
    keepFiles: response.response_files,
    isSubmitting: false,
  };
}

/** Меняет поля предложения; в стоимости оставляет только цифры. */
export function editResponseReducer(
  state: EditResponseState,
  action: EditResponseAction,
): EditResponseState {
  switch (action.type) {
    case "field/change":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "cost/change":
      return {
        ...state,
        cost: action.value.replace(/\D/g, ""),
      };
    case "vat/change":
      return {
        ...state,
        vatKind: action.value,
      };
    case "file/remove":
      return {
        ...state,
        keepFiles: state.keepFiles.filter((path) => path !== action.path),
      };
    case "submit/start":
      return {
        ...state,
        isSubmitting: true,
      };
    case "submit/success":
    case "submit/error":
      return {
        ...state,
        isSubmitting: false,
      };
  }
}
