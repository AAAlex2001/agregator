const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await fetch(`${API_URL}/login/refresh`, {
          method: "POST",
          credentials: "include",
        });
        return res.ok;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

export async function fetchWithSession(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const response = await fetch(input, { ...init, credentials: "include" });
  if (response.status !== 401) return response;

  const refreshed = await refreshSession();
  if (!refreshed) return response;

  return fetch(input, { ...init, credentials: "include" });
}
