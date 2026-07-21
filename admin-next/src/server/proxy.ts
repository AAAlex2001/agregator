import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function authed(): boolean {
  return cookies().get("admin_session")?.value === process.env.ADMIN_NEXT_SECRET;
}

export async function forward(path: string, init: RequestInit = {}): Promise<NextResponse> {
  const response = await fetch(`${process.env.BACKEND_URL}${path}`, {
    ...init,
    headers: { ...init.headers, "X-Internal-Token": process.env.INTERNAL_API_TOKEN ?? "" },
    cache: "no-store",
  });
  const text = await response.text();
  return new NextResponse(text || null, {
    status: response.status,
    headers: { "Content-Type": response.headers.get("Content-Type") ?? "application/json" },
  });
}

export async function forwardBinary(path: string): Promise<NextResponse> {
  const response = await fetch(`${process.env.BACKEND_URL}${path}`, {
    headers: { "X-Internal-Token": process.env.INTERNAL_API_TOKEN ?? "" },
    cache: "no-store",
  });
  const body = await response.arrayBuffer();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/octet-stream",
      "Content-Disposition": response.headers.get("Content-Disposition") ?? "attachment",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
