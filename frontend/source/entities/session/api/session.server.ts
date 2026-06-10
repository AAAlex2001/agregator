import "server-only";

import type { UserProfile } from "@/source/entities/user";

export async function fetchSessionUserServer(
  apiBaseUrl: string,
  sessionId: string,
): Promise<UserProfile | null> {
  try {
    const response = await fetch(`${apiBaseUrl}/settings/profile`, {
      headers: { Cookie: `session_id=${sessionId}` },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as UserProfile;
  } catch {
    return null;
  }
}
