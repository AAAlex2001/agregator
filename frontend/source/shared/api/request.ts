import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { fetchWithSession } from "@/source/shared/api/session";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";

/** Запрос к API от имени пользователя. При ошибке бросает исключение с текстом от сервера или fallback. */
export async function send(path: string, init: RequestInit, fallback: string): Promise<Response> {
  const response = await fetchWithSession(`${API_URL}${path}`, init);
  if (!response.ok) throw new Error(await readErrorMessage(response, fallback));
  return response;
}

/** Параметры запроса с JSON в теле. */
export function json(method: string, body: object): RequestInit {
  return { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

/** Загрузка одного файла полем «file». Повторяет отправку, если браузер потерял файл во время запроса. */
export async function upload(path: string, file: File, fallback: string): Promise<Response> {
  return sendForm(path, "POST", [file], (files) => {
    const body = new FormData();
    body.append("file", files[0]);
    return body;
  }, fallback);
}

/** Форма с файлами. buildBody собирает FormData заново при повторной отправке, если браузер потерял файлы. */
export async function sendForm(
  path: string,
  method: string,
  files: File[],
  buildBody: (files: File[]) => FormData,
  fallback: string,
): Promise<Response> {
  const response = await stableMultipartFetch({ input: `${API_URL}${path}`, method, files, buildBody });
  if (!response.ok) throw new Error(await readErrorMessage(response, fallback));
  return response;
}
