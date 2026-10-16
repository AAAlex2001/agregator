import type { VatKind } from "@/entities/response";

/** Черновик изменённого предложения и состояние его сохранения. */
export interface EditResponseState {
  startDate: string;
  deadline: string;
  cost: string;
  vatKind: VatKind;
  comment: string;
  keepFiles: string[];
  isSubmitting: boolean;
}

/** Поля предложения, которые сохраняются без преобразования. */
export type EditResponseTextField = "startDate" | "deadline" | "comment";

/** Изменения полей, файлов и отправки предложения. */
export type EditResponseAction =
  | { type: "field/change"; field: EditResponseTextField; value: string }
  | { type: "cost/change"; value: string }
  | { type: "vat/change"; value: VatKind }
  | { type: "file/remove"; path: string }
  | { type: "submit/start" }
  | { type: "submit/success" }
  | { type: "submit/error" };
