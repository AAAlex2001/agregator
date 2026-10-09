import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { createSessionToken, sessionCookie } from "@/shared/api/session";

const digest = (value: string) => createHash("sha256").update(value).digest();

/** Сравнение строк за постоянное время — по хэшам, чтобы длина не выдавала пароль. */
const safeEqual = (left: string, right: string) => timingSafeEqual(digest(left), digest(right));

/** Вход по логину и паролю из окружения. Ставит подписанную cookie сессии на 12 часов. */
export async function POST(request: NextRequest) {
  const { login, password } = await request.json();
  const expectedLogin = process.env.ADMIN_NEXT_LOGIN ?? "";
  const expectedPassword = process.env.ADMIN_NEXT_PASSWORD ?? "";

  const valid =
    typeof login === "string" &&
    typeof password === "string" &&
    expectedLogin !== "" &&
    safeEqual(login, expectedLogin) &&
    safeEqual(password, expectedPassword);

  if (!valid) return NextResponse.json({ detail: "Неверный логин или пароль" }, { status: 401 });

  const response = NextResponse.json({ ok: true });

  response.cookies.set(sessionCookie(await createSessionToken()));

  return response;
}
