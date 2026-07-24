import { NextRequest, NextResponse } from "next/server";
import { authed, forward } from "@/server/proxy";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  return forward(`/internal/rtn/questions/${params.id}`);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  const qs = request.nextUrl.searchParams.toString();
  return forward(`/internal/rtn/questions/${params.id}${qs ? `?${qs}` : ""}`, { method: "PATCH" });
}
