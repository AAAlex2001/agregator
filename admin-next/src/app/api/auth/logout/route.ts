import { NextResponse } from "next/server";
import { sessionCookie } from "@/shared/api/session";

/** Выход: удаляет cookie сессии. */
export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(sessionCookie("", 0));

  return response;
}
