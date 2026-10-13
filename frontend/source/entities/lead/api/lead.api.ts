import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import type { LeadPayload } from "../model/types";

/** Заявка с сайта от незарегистрированного посетителя. */
export async function submitLead(payload: LeadPayload): Promise<void> {
  const response = await fetch(`${API_URL}/public/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Не удалось отправить заявку"));
}
