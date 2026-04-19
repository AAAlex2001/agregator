import { fetchBase } from "@/source/shared/api/base";

export interface PartySuggestion {
  value: string;
  unrestricted_value: string;
  data: {
    inn: string | null;
    kpp: string | null;
    ogrn: string | null;
    name: string | null;
    short_name: string | null;
  };
}

export async function fetchPartySuggestions(query: string): Promise<PartySuggestion[]> {
  return fetchBase<PartySuggestion[]>("/register/party-suggestions", {
    method: "POST",
    body: {
      query,
      count: 10,
    },
  });
}