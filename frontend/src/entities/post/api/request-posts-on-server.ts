import "server-only";

import { cookies } from "next/headers";
import { SERVER_API_URL } from "@/shared/config/server-api";

/** Передаёт сессию посетителя, чтобы API вернул его черновики и отметки. */
export async function requestPostsOnServer(path: string): Promise<Response> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session_id")?.value;
  const headers: HeadersInit = session
    ? {
        Cookie: `session_id=${session}`,
      }
    : {};

  return fetch(`${SERVER_API_URL}${path}`, {
    headers,
    cache: "no-store",
  });
}
