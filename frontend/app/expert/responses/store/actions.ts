import { fetchResponses } from "./api";
import { mapResponseItemToCard } from "./mappers";
import type { ResponseTabKey } from "./types";

export async function loadResponses(
  tab: ResponseTabKey,
  onSuccess?: (payload: {
    items: ReturnType<typeof mapResponseItemToCard>[];
    total: number;
    counters: {
      review: number;
        in_progress: number;
      rejected: number;
      accepted: number;
      completed: number;
      archive: number;
    };
  }) => void,
  onError?: (message: string) => void
): Promise<void> {
  try {
    const response = await fetchResponses(tab);
    onSuccess?.({
      items: response.items.map(mapResponseItemToCard),
      total: response.total,
      counters: response.counters,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Произошла ошибка при загрузке откликов";
    onError?.(message);
    throw error;
  }
}
