import { fetchBase } from "@/source/shared/api/base";

interface OkResponse {
  message: string;
}

export async function requestPasswordReset(email: string): Promise<void> {
  await fetchBase<OkResponse>("/forgot-password/send-code", {
    method: "POST",
    body: { email },
  });
}

export async function confirmResetCode(email: string, code: string): Promise<void> {
  await fetchBase<OkResponse>("/forgot-password/verify-code", {
    method: "POST",
    body: { email, code },
  });
}

export async function resetPassword(email: string, code: string, password: string): Promise<void> {
  await fetchBase<OkResponse>("/forgot-password/reset-password", {
    method: "POST",
    body: { email, code, new_password: password },
  });
}
