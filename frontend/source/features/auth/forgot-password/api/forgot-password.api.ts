import { fetchBase } from "@/source/shared/api/base";

export async function requestPasswordReset(email: string): Promise<void> {
  await fetchBase<void>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function confirmResetCode(email: string, code: string): Promise<void> {
  await fetchBase<void>("/auth/confirm-code", {
    method: "POST",
    body: { email, code },
  });
}

export async function resetPassword(email: string, code: string, password: string): Promise<void> {
  await fetchBase<void>("/auth/reset-password", {
    method: "POST",
    body: { email, code, new_password: password },
  });
}
