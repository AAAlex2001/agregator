import { NextResponse } from "next/server";
import { authed, forward } from "@/server/proxy";

export async function GET() {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  return forward("/public/rtn/taxonomy");
}
