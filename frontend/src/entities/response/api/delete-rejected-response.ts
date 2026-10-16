import { request } from "@/shared/api/request";

/** Удаляет у заказчика один отклонённый отклик. */
export async function deleteRejectedResponse(responseId: number): Promise<void> {
  await request(`/responses/${responseId}/rejected`, {
    method: "DELETE",
    errorMessage: "Не удалось удалить отклик",
  });
}
