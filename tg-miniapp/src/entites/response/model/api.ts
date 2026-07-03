import { apiJson } from "@/shared/services/api";

export type ResponseStatus =
  | "REVIEW"
  | "REJECTED"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "WITHDRAWN_BY_EXPERT";

export type ResponseTab =
  | "all"
  | "review"
  | "in_progress"
  | "rejected"
  | "accepted"
  | "withdrawn_by_expert";

export interface ResponseBadge {
  text: string;
  variant: string;
}

export interface ExpertResponse {
  id: number;
  order_id: number;
  status: ResponseStatus;
  date: string;
  comment: string;
  proposed_sum: string;
  proposed_deadline: string;
  order_title: string;
  order_sum: string;
  customer_name: string;
  customer_company: string;
  badges: ResponseBadge[];
}

export interface ResponseCounters {
  all: number;
  review: number;
  in_progress: number;
  rejected: number;
  accepted: number;
  withdrawn_by_expert: number;
}

export interface ResponseList {
  items: ExpertResponse[];
  has_more: boolean;
  counters: ResponseCounters;
}

export function listResponses(tab: ResponseTab, skip = 0, limit = 50): Promise<ResponseList> {
  return apiJson<ResponseList>(`/responses?tab=${tab}&skip=${skip}&limit=${limit}`);
}

export function withdrawResponse(id: number): Promise<unknown> {
  return apiJson(`/responses/${id}`, { method: "DELETE" });
}

export function restoreResponse(id: number): Promise<unknown> {
  return apiJson(`/responses/${id}/restore`, { method: "POST" });
}
