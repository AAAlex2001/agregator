import { request } from "@/shared/api/request";
import type { CommissionApplication } from "../model/types";

/** Отправляет заявку кандидата в конкурсную комиссию. */
export async function submitCommissionApplication(
  application: CommissionApplication,
): Promise<void> {
  await request("/commission/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
    errorMessage: "Не удалось отправить заявку",
  });
}
