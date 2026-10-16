import { request } from "@/shared/api/request";

/** Меняет пароль действующего аккаунта после проверки повторного ввода. */
export async function changePassword(password: string, repeatedPassword: string): Promise<void> {
  await request("/settings/password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      new_password: password,
      new_password_confirm: repeatedPassword,
    }),
    errorMessage: "Не удалось сменить пароль",
  });
}
