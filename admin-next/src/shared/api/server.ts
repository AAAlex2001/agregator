import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "./session";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://backend:8000/api";

const ALLOWED_PREFIXES = ["content/", "leads", "contact-deals", "rtn/"];

const PUBLIC_PATHS = new Set(["rtn/taxonomy"]);

const PASSED_HEADERS = ["content-type", "content-disposition", "content-length"];

/** Есть ли у текущего запроса действующая сессия админки. */
export const hasSession = async (): Promise<boolean> =>
  isValidSessionToken((await cookies()).get(SESSION_COOKIE)?.value);

/** Ответ 401 для запросов без сессии. */
export const unauthorized = () => NextResponse.json({ detail: "Не авторизован" }, { status: 401 });

/**
 * Переслать запрос на бэкенд с внутренним токеном. Путь /api/<path> уходит в /internal/<path>,
 * справочники — в /public. Тело и файлы передаются потоком, ответ отдаётся как есть.
 */
export const proxyToBackend = async (request: NextRequest, path: string): Promise<NextResponse> => {
  if (!ALLOWED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return NextResponse.json({ detail: "Не найдено" }, { status: 404 });
  }

  const scope = PUBLIC_PATHS.has(path) ? "public" : "internal";
  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const headers: Record<string, string> = { "X-Internal-Token": process.env.INTERNAL_API_TOKEN ?? "" };
  const contentType = request.headers.get("content-type");

  if (contentType) headers["Content-Type"] = contentType;

  const response = await fetch(`${BACKEND_URL}/${scope}/${path}${request.nextUrl.search}`, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    cache: "no-store",
    ...(hasBody && { duplex: "half" }),
  } as RequestInit);

  const responseHeaders = new Headers();

  for (const name of PASSED_HEADERS) {
    const value = response.headers.get(name);

    if (value) responseHeaders.set(name, value);
  }

  return new NextResponse(response.body, { status: response.status, headers: responseHeaders });
};
