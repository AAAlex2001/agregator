import { request } from "@/shared/api/request";
import type { ResponseStatus } from "../model/types";

/** Переводит отклик в новый статус; причину отказа сервер принимает полем формы. */
export async function updateResponseStatus(
  responseId: number,
  status: ResponseStatus,
  rejectionReason = "",
): Promise<void> {
  const body = new FormData();

  if (rejectionReason) {
    body.append("rejection_reason", rejectionReason);
  }

  await request(`/responses/${responseId}/status?new_status=${status}`, {
    method: "PATCH",
    body,
    errorMessage: "Ошибка обновления статуса",
  });
}
