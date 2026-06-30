const API = "/api";

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function messageFrom(body: unknown, status: number): string {
  const detail = (body as { detail?: unknown; message?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  if (detail && typeof (detail as { message?: unknown }).message === "string") {
    return (detail as { message: string }).message;
  }
  const msg = (body as { message?: unknown } | null)?.message;
  if (typeof msg === "string") return msg;
  return `Ошибка ${status}`;
}

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  return fetch(`${API}${path}`, { ...init, headers, credentials: "include" });
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await request(path, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let body: unknown = null;
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
    throw new ApiError(res.status, messageFrom(body, res.status), body);
  }
  return (await res.json()) as T;
}

export type Role = "EXPERT" | "CUSTOMER" | "LICENSE_HOLDER";

export interface TelegramAuthResp {
  linked: boolean;
  role?: Role;
}

export const telegramAuth = (initData: string) =>
  apiJson<TelegramAuthResp>("/tg-auth/telegram", {
    method: "POST",
    body: JSON.stringify({ init_data: initData }),
  });

export const telegramLink = (initData: string, email: string, password: string, role?: Role) =>
  apiJson<TelegramAuthResp>("/tg-auth/telegram/link", {
    method: "POST",
    body: JSON.stringify({ init_data: initData, email, password, role: role ?? null }),
  });

export const logout = () => apiJson("/login/logout", { method: "POST" });
