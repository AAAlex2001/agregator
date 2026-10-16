import { request } from "@/shared/api/request";

/** Сохраняет новый пароль после проверки кода восстановления. */
export async function resetPassword(
  email: string,
  code: string,
  password: string,
): Promise<void> {
  await request("/forgot-password/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, new_password: password }),
    errorMessage: "Не удалось сменить пароль",
  });
}
