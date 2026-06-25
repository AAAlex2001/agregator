import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", "", {
    path: process.env.NEXT_PUBLIC_BASE_PATH || "/",
    maxAge: 0,
  });
  return response;
}
