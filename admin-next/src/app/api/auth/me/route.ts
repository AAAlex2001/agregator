import { NextResponse } from "next/server";
import { hasSession, unauthorized } from "@/shared/api/server";

/** Проверка сессии при открытии админки. */
export async function GET() {
  return (await hasSession()) ? NextResponse.json({ ok: true }) : unauthorized();
}
