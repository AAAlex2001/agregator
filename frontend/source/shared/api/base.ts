import { API_URL } from "./config";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: Method;
  body?: unknown;
  token?: string | null;
  credentials?: RequestCredentials;
}

/**
 * UNSAFE: when the server returns an empty body, this function returns `undefined`
 * cast as `T`. Callers that declare a non-nullable `T` must only invoke this for
 * endpoints that are guaranteed to return a JSON body. For endpoints that may
 * return empty bodies, either `await` and discard the result or call with a
 * nullable type argument (e.g. `fetchBase<T | null>`).
 * TODO: change the signature to `Promise<T | null>` and update callers.
 */
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
