import { request } from "@/shared/api/request";

/** Проверяет код восстановления перед вводом нового пароля. */
export async function confirmResetCode(email: string, code: string): Promise<void> {
  await request("/forgot-password/verify-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
    errorMessage: "Неверный код",
  });
}
