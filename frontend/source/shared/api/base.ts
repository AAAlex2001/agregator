import { API_URL } from "./config";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: Method;
  body?: unknown;
  token?: string | null;
  credentials?: RequestCredentials;
}

export async function fetchBase<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token, credentials } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP Error ${res.status}` }));
    throw new Error(err.detail || `HTTP Error ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as unknown as T);
}
