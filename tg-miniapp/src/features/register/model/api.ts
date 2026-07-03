import { apiJson, type Role } from "@/shared/services/api";

export interface RegisterPayload {
  role: Role;
  email: string;
  password: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
}

export function registerUser(payload: RegisterPayload): Promise<{ id: number }> {
  return apiJson("/register/", { method: "POST", body: JSON.stringify(payload) });
}

export function confirmEmail(email: string, code: string, role: Role): Promise<unknown> {
  return apiJson("/register/confirm-email", {
    method: "POST",
    body: JSON.stringify({ email, code, role }),
  });
}

export function resendCode(email: string, role: Role): Promise<unknown> {
  return apiJson("/register/resend-code", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
}
