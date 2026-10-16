import { request } from "@/shared/api/request";

/** Завершает серверную сессию перед очисткой локального пользователя. */
export async function logout(): Promise<void> {
  await request("/login/logout", {
    method: "POST",
    errorMessage: "Не удалось выйти из аккаунта",
  });
}
