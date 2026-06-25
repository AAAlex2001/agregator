import { NextRequest, NextResponse } from "next/server";
import { authed, forward } from "@/server/proxy";

export async function POST(request: NextRequest) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  const form = await request.formData();
  return forward("/internal/content/upload-image", { method: "POST", body: form });
}
