import { request } from "@/shared/api/request";

/** Отправляет код на новый адрес; текущая почта пока остаётся прежней. */
export async function requestEmailChange(email: string): Promise<void> {
  await request("/settings/email/request-change", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ new_email: email }),
    errorMessage: "Не удалось отправить код",
  });
}
