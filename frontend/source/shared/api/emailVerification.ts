"use client";

import { API_URL } from "./config";

export type EmailVerificationRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

export interface ConfirmedUser {
  id: number;
  role: EmailVerificationRole;
  email: string | null;
  phone: string | null;
  created_at: string;
}

async function readError(res: Response, fallback: string): Promise<string> {
  const body = await res.json().catch(() => null);
  if (typeof body?.detail === "string") return body.detail;
  if (typeof body?.detail?.message === "string") return body.detail.message;
  return fallback;
}

export async function confirmEmailCode(
  email: string,
  code: string,
  role: EmailVerificationRole | null = null,
): Promise<ConfirmedUser> {
  const res = await fetch(`${API_URL}/register/confirm-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, code, role: role ?? undefined }),
  });
  if (!res.ok) throw new Error(await readError(res, "Не удалось подтвердить почту"));
  return res.json();
}

export async function resendEmailCode(
  email: string,
  role: EmailVerificationRole | null = null,
): Promise<void> {
  const res = await fetch(`${API_URL}/register/resend-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, role: role ?? undefined }),
  });
  if (!res.ok) throw new Error(await readError(res, "Не удалось отправить код"));
}
