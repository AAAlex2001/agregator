import { NextRequest, NextResponse } from "next/server";
import { authed, forward } from "@/server/proxy";

export async function GET() {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  return forward("/internal/content/tags");
}

export async function POST(request: NextRequest) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  const body = await request.text();
  return forward("/internal/content/tags", {
    method: "POST",
    body,
    headers: { "Content-Type": "application/json" },
  });
}
