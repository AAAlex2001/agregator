import { apiJson } from "@/shared/services/api";
import type { Role } from "@/shared/services/api";

export interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: Role;
}

export const getProfile = () => apiJson<Profile>("/settings/profile");

export const updateProfile = (fields: { first_name?: string; last_name?: string; phone?: string }) =>
  apiJson<Profile>("/settings/profile", { method: "PUT", body: JSON.stringify(fields) });

export const requestEmailChange = (newEmail: string) =>
  apiJson<{ detail: string }>("/settings/email/request-change", {
    method: "POST",
    body: JSON.stringify({ new_email: newEmail }),
  });

export const confirmEmailChange = (code: string) =>
  apiJson<Profile>("/settings/email/confirm-change", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
