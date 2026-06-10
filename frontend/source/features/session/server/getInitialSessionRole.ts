import "server-only";

import { cookies, headers } from "next/headers";
import { fetchSessionUserServer } from "@/source/entities/session/api/session.server";
import { normalizeSessionRole } from "../model/sessionRole";
import type { SessionRole } from "../model/types";

export async function getInitialSessionRole(): Promise<SessionRole | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return null;
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

  const user = await fetchSessionUserServer(apiBaseUrl, sessionId);
  return normalizeSessionRole(user?.role);
}
