import { request } from "@/shared/api/request";

/** Удаляет у заказчика все отклонённые отклики. */
export async function deleteRejectedResponses(): Promise<void> {
  await request("/responses/rejected/all", {
    method: "DELETE",
    errorMessage: "Не удалось удалить отклики",
  });
}
