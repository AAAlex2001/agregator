import { NextResponse, type NextRequest } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "@/shared/api/session";
import { LOGIN_PATH } from "@/shared/lib/admin-paths";

/** Страницы админки открываются только с действующей сессией; API и вход проверяют себя сами. */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api") || pathname.startsWith(LOGIN_PATH)) return NextResponse.next();

  if (await isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  const url = request.nextUrl.clone();

  url.pathname = LOGIN_PATH;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|fonts|favicon.ico).*)"],
};
