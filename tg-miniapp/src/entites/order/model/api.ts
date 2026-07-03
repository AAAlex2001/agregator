import { apiJson } from "@/shared/services/api";

export interface OrderBadge {
  text: string;
  variant: string;
}

export interface OrderDocuments {
  technical: string[];
  contract: string[];
  company: string[];
  other: string[];
}

export interface Order {
  id: number;
  public_id: string;
  title: string;
  company: string;
  comment: string;
  customer_name: string;
  customer_inn: string;
  sum: string;
  sum_amount_raw: number;
  start_date: string;
  date: string;
  deadline_at: string;
  created_at: string;
  responses_deadline: string | null;
  requires_license: boolean;
  documents: OrderDocuments;
  badges: OrderBadge[];
  status: string;
}

export interface OrderList {
  items: Order[];
  has_more: boolean;
}

const DOC_LABELS: Record<keyof OrderDocuments, string> = {
  technical: "Техническое задание",
  contract: "Проект договора",
  company: "Карточка компании",
  other: "Документ",
};

export interface OrderDocument {
  label: string;
  url: string;
  name: string;
}

export function orderDocuments(order: Order): OrderDocument[] {
  const docs = order.documents;
  if (!docs) return [];
  const groups: (keyof OrderDocuments)[] = ["technical", "contract", "company", "other"];
  const result: OrderDocument[] = [];
  for (const group of groups) {
    for (const url of docs[group] ?? []) {
      result.push({ label: DOC_LABELS[group], url, name: url.split("/").pop() || "файл" });
    }
  }
  return result;
}

export const listOrders = (limit = 10) =>
  apiJson<OrderList>(`/orders/?skip=0&limit=${limit}`);

export const listArchivedOrders = (limit = 20) =>
  apiJson<OrderList>(`/orders/archive?skip=0&limit=${limit}`);
