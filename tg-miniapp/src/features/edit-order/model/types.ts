import type { OrderDocuments } from "@/entites/order";

export type EditOrderField = "title" | "sum" | "startDate" | "deadline" | "responsesDeadline" | "comment";

export interface EditOrderState {
  title: string;
  sum: string;
  startDate: string;
  deadline: string;
  responsesDeadline: string;
  comment: string;
  keepDocuments: OrderDocuments;
  newFiles: File[];
  notifyResponders: boolean;
  busy: boolean;
  copySourceOrderId: number | null;
}

export type EditOrderPrefill = Omit<EditOrderState, "newFiles" | "notifyResponders" | "busy">;

export type EditOrderAction =
  | { type: "prefill"; payload: EditOrderPrefill }
  | { type: "set"; key: EditOrderField; value: string }
  | { type: "removeKeep"; url: string }
  | { type: "addFiles"; files: File[] }
  | { type: "removeNew"; index: number }
  | { type: "notifyResponders"; value: boolean }
  | { type: "busy"; value: boolean };
