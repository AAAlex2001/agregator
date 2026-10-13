import { json, send } from "@/source/shared/api/request";

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

/** Подсказки по компаниям из ДаДата по ИНН или названию. */
export async function fetchPartySuggestions(query: string): Promise<PartySuggestion[]> {
  const response = await send("/register/party-suggestions", json("POST", { query, count: 10 }), "Не удалось найти компанию");
  return response.json();
}
