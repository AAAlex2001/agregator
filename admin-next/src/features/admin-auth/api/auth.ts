import { adminRequest, jsonBody } from "@/shared/api";

/** Войти в админку. Сервер ставит cookie сессии. */
export const login = (adminLogin: string, password: string) =>
  adminRequest<void>("/auth/login", jsonBody("POST", { login: adminLogin, password }));

/** Выйти из админки. */
export const logout = () => adminRequest<void>("/auth/logout", { method: "POST" });

/** Проверить сессию. Без входа запрос падает с ошибкой. */
export const fetchMe = () => adminRequest<void>("/auth/me");
