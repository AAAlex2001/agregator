import { apiJson } from "@/shared/services/api";

export interface Party {
  value: string;
  unrestricted_value: string;
  data: { inn?: string | null };
}

export function suggestParties(query: string): Promise<Party[]> {
  return apiJson<Party[]>("/register/party-suggestions", {
    method: "POST",
    body: JSON.stringify({ query, count: 8 }),
  });
}
