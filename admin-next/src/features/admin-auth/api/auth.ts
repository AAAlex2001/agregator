import { adminFetch, jsonBody } from "@/shared/api";

/** Войти в админку. Сервер ставит cookie сессии. */
export const login = async (adminLogin: string, password: string): Promise<void> => {
  await adminFetch("/auth/login", jsonBody("POST", { login: adminLogin, password }));
};

/** Выйти из админки. */
export const logout = async (): Promise<void> => {
  await adminFetch("/auth/logout", { method: "POST" });
};

/** Проверить сессию. Без входа запрос падает с ошибкой. */
export const fetchMe = async (): Promise<void> => {
  await adminFetch("/auth/me");
};
