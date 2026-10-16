import { API_URL } from "@/shared/config/api";
import { refreshSession } from "./refresh-session";

/** Отправляет запрос с cookie и один раз повторяет его после обновления сессии. */
export async function fetchWithSession(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${API_URL}${path}`;
  const requestOptions: RequestInit = {
    ...options,
    credentials: "include",
    cache: "no-store",
  };

  try {
    const response = await fetch(url, requestOptions);

    if (response.status !== 401 || options.signal?.aborted) {
      return response;
    }

    const sessionRestored = await refreshSession();

    if (!sessionRestored || options.signal?.aborted) {
      return response;
    }

    return await fetch(url, requestOptions);
  } catch (error) {
    if (options.signal?.aborted) {
      throw error;
    }

    throw new Error(
      "Не удалось связаться с сервером. Проверьте подключение к интернету.",
    );
  }
}
