interface ErrorBody {
  detail?: string | { message?: string } | Array<{ msg?: string }>;
}

export function extractErrorMessage(body: unknown): string | undefined {
  const detail = (body as ErrorBody | null)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail[0]?.msg;
  if (typeof detail?.message === "string") return detail.message;
  return undefined;
}

export async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    return extractErrorMessage(body) ?? fallback;
  } catch {
    return fallback;
  }
}
