import { NextRequest, NextResponse } from "next/server";
import { authed, forward } from "@/server/proxy";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  const body = await request.text();
  return forward(`/internal/leads/${params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
