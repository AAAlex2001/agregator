import { request } from "@/shared/api/request";
import type { UserRole } from "../model/types";

/** Повторно отправляет письмо для подтверждения выбранного аккаунта. */
export async function resendConfirmationCode(
  email: string,
  role: UserRole | null,
): Promise<void> {
  await request("/register/resend-code", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, role: role ?? undefined }),
    errorMessage: "Не удалось отправить код",
  });
}
