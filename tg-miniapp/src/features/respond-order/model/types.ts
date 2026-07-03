import type { Party, VatKind } from "./api";

export interface RespondState {
  startDate: string;
  deadline: string;
  sum: string;
  vat: VatKind;
  comment: string;
  companyName: string;
  party: Party | null;
  files: File[];
  busy: boolean;
  done: boolean;
}

export type RespondAction =
  | { type: "reset" }
  | { type: "startDate"; value: string }
  | { type: "deadline"; value: string }
  | { type: "sum"; value: string }
  | { type: "vat"; value: VatKind }
  | { type: "comment"; value: string }
  | { type: "companyText"; value: string }
  | { type: "companyPick"; party: Party }
  | { type: "addFiles"; files: File[] }
  | { type: "removeFile"; index: number }
  | { type: "busy"; value: boolean }
  | { type: "done" };
