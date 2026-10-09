import { API_URL } from "./config";
import { readErrorMessage } from "./errors";

/** Событие в window: сессия админки истекла, оболочка уводит на страницу входа. */
export const UNAUTHORIZED_EVENT = "admin:unauthorized";

/** Запрос к API админки. Cookie со входом браузер прикладывает сам; 204 возвращает undefined. */
export const adminRequest = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, { cache: "no-store", ...init });

  if (response.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    throw new Error("Сессия истекла, войдите заново");
  }

  if (!response.ok) throw new Error(await readErrorMessage(response));

  return response.status === 204 ? (undefined as T) : response.json();
};

/** Параметры запроса с JSON в теле. */
export const jsonBody = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

/** Параметры запроса с одним файлом в multipart-теле. */
export const fileBody = (file: File): RequestInit => {
  const body = new FormData();

  body.append("file", file);

  return { method: "POST", body };
};
