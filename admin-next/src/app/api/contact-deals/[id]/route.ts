import { NextRequest, NextResponse } from "next/server";
import { authed, forward } from "@/server/proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  return forward(`/internal/contact-deals/${params.id}`);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  return forward(`/internal/contact-deals/${params.id}/release`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
}
