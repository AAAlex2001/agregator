import { request } from "@/shared/api/request";
import type { LoginResponse, UserRole } from "../model/types";

/** Подтверждает почту; при успехе сервер сразу открывает сессию. */
export async function confirmEmail(
  email: string,
  code: string,
  role: UserRole | null,
): Promise<LoginResponse> {
  const response = await request("/register/confirm-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      code,
      role: role ?? undefined,
    }),
    errorMessage: "Не удалось подтвердить почту",
  });

  return response.json();
}
