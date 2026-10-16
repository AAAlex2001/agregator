/** Читает понятное сообщение из ответа API; неизвестный формат заменяет подсказкой. */
export async function readResponseError(
  response: Response,
  fallback: string,
): Promise<string> {
  try {
    const body: unknown = await response.json();

    if (!body || typeof body !== "object" || !("detail" in body)) {
      return fallback;
    }

    const detail = body.detail;
    let message: unknown;

    if (typeof detail === "string") {
      message = detail;
    } else if (Array.isArray(detail)) {
      message = detail[0]?.msg;
    } else if (detail && typeof detail === "object" && "message" in detail) {
      message = detail.message;
    }

    if (typeof message !== "string") {
      return fallback;
    }

    return message.replace(/^Value error,\s*/, "").trim() || fallback;
  } catch {
    return fallback;
  }
}
