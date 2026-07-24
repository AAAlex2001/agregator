import { NextRequest, NextResponse } from "next/server";
import { authed, forward } from "@/server/proxy";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  return forward(`/internal/rtn/clarifications/${params.id}`);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  const body = await request.text();
  return forward(`/internal/rtn/clarifications/${params.id}`, {
    method: "PUT",
    body,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  return forward(`/internal/rtn/clarifications/${params.id}`, { method: "DELETE" });
}
