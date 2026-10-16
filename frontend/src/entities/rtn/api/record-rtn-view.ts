import { fetchWithSession } from "@/shared/api/fetch-with-session";

/** Засчитывает просмотр; сбой счётчика не мешает загрузить оценки и читать материал. */
export async function recordRtnView(clarificationId: number): Promise<void> {
  await fetchWithSession(`/public/rtn/clarifications/${clarificationId}/view`, {
    method: "POST",
  }).catch(() => undefined);
}
