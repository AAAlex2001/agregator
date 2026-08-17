interface ErrorBody {
  detail?: string | { message?: string } | Array<{ msg?: string }>;
}

export function extractErrorMessage(body: unknown): string | undefined {
  const detail = (body as ErrorBody | null)?.detail;
  const message =
    typeof detail === "string"
      ? detail
      : Array.isArray(detail)
        ? detail[0]?.msg
        : typeof detail?.message === "string"
          ? detail.message
          : undefined;
  return message?.replace(/^Value error,\s*/, "").trim();
}

export async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    return extractErrorMessage(body) ?? fallback;
  } catch {
    return fallback;
  }
}
