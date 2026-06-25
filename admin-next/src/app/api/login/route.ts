import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { login, password } = await request.json();
  if (login !== process.env.ADMIN_NEXT_LOGIN || password !== process.env.ADMIN_NEXT_PASSWORD) {
    return NextResponse.json({ message: "Неверный логин или пароль" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", process.env.ADMIN_NEXT_SECRET ?? "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: process.env.NEXT_PUBLIC_BASE_PATH || "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}
