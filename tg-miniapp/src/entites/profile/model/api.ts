import { apiJson } from "@/shared/services/api";
import type { Role } from "@/shared/services/api";
import type { AvailableRole, EmailPreferences, Profile, UpdateProfileInput } from "./types";

export const getProfile = () => apiJson<Profile>("/settings/profile");

export const getAvailableRoles = () =>
  apiJson<{ roles: AvailableRole[] }>("/login/available-roles");

export const switchRole = (role: Role, password: string) =>
  apiJson<{ role: Role }>("/login/switch-role", {
    method: "POST",
    body: JSON.stringify({ role, password }),
  });

export const updateProfile = (fields: UpdateProfileInput) =>
  apiJson<Profile>("/settings/profile", { method: "PUT", body: JSON.stringify(fields) });

export const updateEmailPreferences = (patch: Partial<EmailPreferences>) =>
  apiJson<Profile>("/settings/email-preferences", { method: "PUT", body: JSON.stringify(patch) });

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
