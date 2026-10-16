import { API_URL } from "@/shared/config/api";

/** Общий запрос обновления сессии, который ждут одновременные запросы. */
let sessionRefreshRequest: Promise<Response> | null = null;

/** Обновляет cookie сессии; одновременные запросы ждут одного обновления. */
export async function refreshSession(): Promise<boolean> {
  if (!sessionRefreshRequest) {
    sessionRefreshRequest = fetch(`${API_URL}/login/refresh`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    }).finally(() => {
      sessionRefreshRequest = null;
    });
  }

  try {
    const response = await sessionRefreshRequest;

    return response.ok;
  } catch {
    return false;
  }
}
