import { request } from "@/shared/api/request";

/** Возвращает исполнителю ранее отозванный отклик. */
export async function restoreWithdrawnResponse(responseId: number): Promise<void> {
  await request(`/responses/${responseId}/restore`, {
    method: "POST",
    errorMessage: "Не удалось восстановить отклик",
  });
}
