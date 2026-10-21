/** Ошибка поля: путь в данных запроса и текст; «Обязательное поле» без названия поля непонятно. */
export interface ApiFieldError {
  path: string;
  message: string;
  needsLabel: boolean;
}

/** Ошибка запроса: общий текст и ошибки отдельных полей, если сервер их назвал. */
export class ApiError extends Error {
  readonly fields: ApiFieldError[];

  constructor(message: string, fields: ApiFieldError[]) {
    super(message);
    this.name = "ApiError";
    this.fields = fields;
  }
}

/** Текст, когда запрос не дошёл до сервера. */
export const NETWORK_ERROR = "Не удалось связаться с сервером. Проверьте подключение к интернету.";

/** Служебные части пути FastAPI: тело запроса и JSON-поле формы. */
const SERVICE_PARTS = new Set(["body", "payload", "query", "path"]);

/** Путь к полю из loc FastAPI: ["body", "payload", "company", "inn"] → "company.inn". */
function toFieldPath(loc: unknown): string {
  if (!Array.isArray(loc)) {
    return "";
  }

  const parts = loc.map(String);
  const start = parts.findIndex((part) => !SERVICE_PARTS.has(part));

  return start === -1 ? "" : parts.slice(start).join(".");
}

/** Ошибки полей из ответа проверки FastAPI. */
function validationFields(detail: unknown[]): ApiFieldError[] {
  return detail.flatMap((item) => {
    if (!item || typeof item !== "object" || !("msg" in item) || typeof item.msg !== "string") {
      return [];
    }

    const path = "loc" in item ? toFieldPath(item.loc) : "";

    return [{ path, message: item.msg.replace(/^Value error,\s*/, ""), needsLabel: true }];
  });
}

/** Ошибка из ответа API: текст и поля. Неизвестный формат заменяет подсказкой fallback. */
export async function readApiError(response: Response, fallback: string): Promise<ApiError> {
  try {
    const body: unknown = await response.json();

    if (!body || typeof body !== "object" || !("detail" in body)) {
      return new ApiError(fallback, []);
    }

    const { detail } = body;

    if (typeof detail === "string") {
      const field = "field" in body && typeof body.field === "string" ? body.field : "";
      const fields = field ? [{ path: field, message: detail, needsLabel: false }] : [];

      return new ApiError(detail.trim() || fallback, fields);
    }

    if (Array.isArray(detail)) {
      const fields = validationFields(detail);

      return new ApiError(fields[0]?.message || fallback, fields);
    }

    if (detail && typeof detail === "object" && "message" in detail) {
      return new ApiError(typeof detail.message === "string" ? detail.message : fallback, []);
    }

    return new ApiError(fallback, []);
  } catch {
    return new ApiError(fallback, []);
  }
}

/** Понятный текст ошибки из ответа API; неизвестный формат заменяет подсказкой. */
export async function readResponseError(response: Response, fallback: string): Promise<string> {
  return (await readApiError(response, fallback)).message;
}