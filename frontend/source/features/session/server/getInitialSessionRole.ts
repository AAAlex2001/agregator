import "server-only";

import { cookies, headers } from "next/headers";
import { normalizeSessionRole } from "../model/sessionRole";
import type { SessionRole } from "../model/types";

export async function getInitialSessionRole(): Promise<SessionRole | null> {
  const cookieStore = await cookies();
  const cookieRole = normalizeSessionRole(cookieStore.get("user_role")?.value);

  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return cookieRole;
  }

  const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
  let apiBaseUrl: string | null = null;

  if (envApiUrl && /^https?:\/\//i.test(envApiUrl)) {
    apiBaseUrl = envApiUrl.replace(/\/$/, "");
  } else {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

    if (host) {
      const protocol = headersList.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "development" ? "http" : "https");
      apiBaseUrl = `${protocol}://${host}/api`;
    }
  }

  if (!apiBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/settings/profile`, {
      headers: { Cookie: `session_id=${sessionId}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return cookieRole;
    }

    const body = (await response.json()) as { role?: string };
    return normalizeSessionRole(body.role) ?? cookieRole;
  } catch {
    return cookieRole;
  }
}