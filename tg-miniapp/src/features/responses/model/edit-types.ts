import type { VatKind } from "@/entites/response";

export interface EditResponseState {
  startDate: string;
  deadline: string;
  sum: string;
  vat: VatKind;
  comment: string;
  keepFiles: string[];
  newFiles: File[];
  busy: boolean;
}

export type EditResponsePrefill = Pick<
  EditResponseState,
  "startDate" | "deadline" | "sum" | "vat" | "comment" | "keepFiles"
>;

export type EditResponseAction =
  | { type: "prefill"; payload: EditResponsePrefill }
  | { type: "startDate"; value: string }
  | { type: "deadline"; value: string }
  | { type: "sum"; value: string }
  | { type: "vat"; value: VatKind }
  | { type: "comment"; value: string }
  | { type: "removeKeep"; url: string }
  | { type: "addFiles"; files: File[] }
  | { type: "removeNew"; index: number }
  | { type: "busy"; value: boolean };
