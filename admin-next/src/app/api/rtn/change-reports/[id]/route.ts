import { NextRequest, NextResponse } from "next/server";
import { authed, forward } from "@/server/proxy";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  const qs = request.nextUrl.searchParams.toString();
  return forward(`/internal/rtn/change-reports/${params.id}${qs ? `?${qs}` : ""}`, { method: "PATCH" });
}
