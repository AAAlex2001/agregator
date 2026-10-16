import type { OrderListItem } from "./order-list-item";
import type { OrderDocuments } from "./types";

/** Условия заказа, отправляемые при создании и редактировании. */
export interface OrderRequest {
  title: string;
  company: string;
  comment: string;
  sum_amount: number;
  start_date: string;
  deadline: string;
  responses_deadline: string;
  requires_expert: boolean;
  requires_license: boolean;
  work_type: OrderListItem["work_type"];
  badge_codes: string[];
  details: OrderListItem["details"];
}

/** Категории заказа, в которых допускается один документ. */
export type SingleOrderDocumentCategory = "technical" | "contract" | "company";

/** Новые файлы заказа, ещё не загруженные на сервер. */
export interface NewOrderFiles {
  technical: File | null;
  contract: File | null;
  company: File | null;
  other: File[];
}

/** Сохраняемые документы, новые файлы и исходный заказ при копировании. */
export interface OrderDocumentsRequest {
  existing: OrderDocuments;
  copySourceOrderId: number | null;
  files: NewOrderFiles;
}
