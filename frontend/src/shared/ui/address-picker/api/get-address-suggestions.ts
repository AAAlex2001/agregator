import { API_URL } from "@/shared/config/api";
import type { SelectedLocation } from "../model/types";

/** Находит подходящие адреса; недоступные подсказки не блокируют ввод. */
export async function getAddressSuggestions(query: string): Promise<SelectedLocation[]> {
  try {
    const response = await fetch(
      `${API_URL}/geo/suggest?q=${encodeURIComponent(query)}`,
      { credentials: "include" },
    );

    if (!response.ok) {
      return [];
    }

    const result: { items: SelectedLocation[] } = await response.json();
    return result.items;
  } catch {
    return [];
  }
}
