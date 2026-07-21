import { NextRequest, NextResponse } from "next/server";
import { authed, forwardBinary } from "@/server/proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; receiptId: string } },
) {
  if (!authed()) return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  return forwardBinary(`/internal/contact-deals/${params.id}/receipts/${params.receiptId}`);
}
