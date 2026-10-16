import { readResponseError } from "@/shared/api/response-error";
import { API_URL } from "@/shared/config/api";
import type { LoginResponse, UserRole } from "../model/types";

/** Открывает сессию другого аккаунта на ту же почту после проверки его пароля. */
export async function switchRole(
  role: UserRole,
  password: string,
): Promise<LoginResponse> {
  // При неверном пароле API отвечает 401; повторять такой POST после refresh нельзя.
  const response = await fetch(`${API_URL}/login/switch-role`, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, password }),
  }).catch(() => {
    throw new Error(
      "Не удалось связаться с сервером. Проверьте подключение к интернету.",
    );
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response, "Не удалось переключить роль"));
  }

  return response.json();
}
