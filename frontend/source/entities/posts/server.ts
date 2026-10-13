import "server-only";

import { cookies } from "next/headers";
import { SERVER_API_URL } from "@/source/shared/api/config";
import type { Post, PostPage } from "./model/types";

/** Загружает публичную ленту для первого серверного рендера. */
export async function loadPostsFeed(
  offset: number,
  authorId?: number,
): Promise<PostPage | undefined> {
  const path = authorId ? `author/${authorId}` : "feed";
  const headers = new Headers();
  const session = (await cookies()).get("session_id")?.value;
  if (session) {
    headers.set("Cookie", `session_id=${session}`);
  }
  try {
    const response = await fetch(`${SERVER_API_URL}/posts/${path}?limit=20&offset=${offset}`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (response.ok) return response.json();
  } catch {
    // При недоступном сервере лента предложит повторить загрузку в браузере.
  }
}

/** Загружает пост; сессия нужна только для просмотра своего черновика. */
export async function loadPost(id: number, withSession = false): Promise<Post | null | undefined> {
  const headers = new Headers();
  if (withSession) {
    const session = (await cookies()).get("session_id")?.value;
    if (session) {
      headers.set("Cookie", `session_id=${session}`);
    }
  }
  try {
    const response = await fetch(`${SERVER_API_URL}/posts/${id}`, {
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (response.status === 404) return null;
    if (response.ok) return response.json();
  } catch {
    // Страница сохранит возможность повторной загрузки.
  }
}
