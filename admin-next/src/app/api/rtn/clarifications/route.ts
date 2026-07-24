import { NextRequest, NextResponse } from "next/server";
import { authed, forward } from "@/server/proxy";

export async function GET(request: NextRequest) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  const qs = request.nextUrl.searchParams.toString();
  return forward(`/internal/rtn/clarifications${qs ? `?${qs}` : ""}`);
}

export async function POST(request: NextRequest) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  const body = await request.text();
  return forward("/internal/rtn/clarifications", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
}
