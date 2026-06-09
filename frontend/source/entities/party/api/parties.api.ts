import { fetchBase } from "@/source/shared/api/base";

export interface PartySuggestion {
  value: string;
  unrestricted_value: string;
  data: {
    inn?: string | null;
    kpp?: string | null;
    ogrn?: string | null;
    name?: {
      full_with_opf?: string | null;
      short_with_opf?: string | null;
      full?: string | null;
      short?: string | null;
      latin?: string | null;
    } | null;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export async function fetchPartySuggestions(query: string): Promise<PartySuggestion[]> {
  const result = await fetchBase<PartySuggestion[]>("/register/party-suggestions", {
    method: "POST",
    body: { query, count: 10 },
  });
  return result ?? [];
}
