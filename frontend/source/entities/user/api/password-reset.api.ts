import { json, send } from "@/source/shared/api/request";

/** Отправить код восстановления пароля на почту. */
export async function requestPasswordReset(email: string): Promise<void> {
  await send("/forgot-password/send-code", json("POST", { email }), "Не удалось отправить код");
}

/** Проверить код восстановления пароля. */
export async function confirmResetCode(email: string, code: string): Promise<void> {
  await send("/forgot-password/verify-code", json("POST", { email, code }), "Неверный код");
}

/** Задать новый пароль по коду восстановления. */
export async function resetPassword(email: string, code: string, password: string): Promise<void> {
  await send("/forgot-password/reset-password", json("POST", { email, code, new_password: password }), "Не удалось сменить пароль");
}
