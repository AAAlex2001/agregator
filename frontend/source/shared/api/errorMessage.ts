export function extractErrorMessage(body: unknown): string | undefined {
  const detail = (body as { detail?: unknown } | null | undefined)?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && typeof detail[0]?.msg === "string") return String(detail[0].msg);
  if (detail && typeof detail === "object" && typeof (detail as { message?: unknown }).message === "string") {
    return (detail as { message: string }).message;
  }
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
