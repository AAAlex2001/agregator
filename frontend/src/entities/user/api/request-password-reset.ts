import { request } from "@/shared/api/request";

/** Отправляет на почту код восстановления пароля. */
export async function requestPasswordReset(email: string): Promise<void> {
  await request("/forgot-password/send-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    errorMessage: "Не удалось отправить код",
  });
}
