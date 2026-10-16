import { readResponseError } from "@/shared/api/response-error";
import { API_URL } from "@/shared/config/api";
import type { LeadRequest } from "../model/types";

/** Отправляет публичную заявку посетителя без обновления пользовательской сессии. */
export async function submitLead(lead: LeadRequest): Promise<void> {
  const response = await fetch(`${API_URL}/public/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lead),
  });

  if (!response.ok) {
    throw new Error(
      await readResponseError(response, "Не удалось отправить заявку"),
    );
  }
}
