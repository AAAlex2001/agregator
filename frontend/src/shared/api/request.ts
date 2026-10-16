import { fetchWithSession } from "./fetch-with-session";
import { readResponseError } from "./response-error";

/** Параметры fetch и сообщение на случай ответа без понятной ошибки. */
interface RequestOptions extends RequestInit {
  errorMessage: string;
}

/** Выполняет HTTP-запрос с cookie; после 401 обновляет сессию и повторяет запрос один раз. */
export async function request(path: string, options: RequestOptions): Promise<Response> {
  const { errorMessage, ...init } = options;
  const response = await fetchWithSession(path, init);

  if (!response.ok) {
    throw new Error(await readResponseError(response, errorMessage));
  }

  return response;
}
