import { apiJson } from "@/shared/services/api";

export function sendResetCode(email: string): Promise<unknown> {
  return apiJson("/forgot-password/send-code", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(email: string, code: string, newPassword: string): Promise<unknown> {
  return apiJson("/forgot-password/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code, new_password: newPassword }),
  });
}
