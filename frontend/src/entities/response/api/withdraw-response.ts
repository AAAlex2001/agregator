import { request } from "@/shared/api/request";

/** Отзывает предложение исполнителя; заказчик получает уведомление. */
export async function withdrawResponse(responseId: number): Promise<void> {
  await request(`/responses/${responseId}`, {
    method: "DELETE",
    errorMessage: "Не удалось отозвать отклик",
  });
}
