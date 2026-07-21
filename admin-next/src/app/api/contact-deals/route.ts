import { NextRequest, NextResponse } from "next/server";
import { authed, forward } from "@/server/proxy";

export async function GET(request: NextRequest) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  const query = request.nextUrl.searchParams.toString();
  return forward(`/internal/contact-deals${query ? `?${query}` : ""}`);
}
