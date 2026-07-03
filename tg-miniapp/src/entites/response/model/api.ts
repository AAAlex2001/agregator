import { apiJson } from "@/shared/services/api";
import type { ResponseList, ResponseTab } from "./types";

export function listResponses(tab: ResponseTab, skip = 0, limit = 50): Promise<ResponseList> {
  return apiJson<ResponseList>(`/responses?tab=${tab}&skip=${skip}&limit=${limit}`);
}

export function withdrawResponse(id: number): Promise<unknown> {
  return apiJson(`/responses/${id}`, { method: "DELETE" });
}

export function restoreResponse(id: number): Promise<unknown> {
  return apiJson(`/responses/${id}/restore`, { method: "POST" });
}
