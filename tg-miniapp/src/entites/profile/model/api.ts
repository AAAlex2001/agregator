import { apiJson } from "@/shared/services/api";
import type { Role } from "@/shared/services/api";

export interface EmailPreferences {
  email_on_response_created: boolean;
  email_on_response_updated: boolean;
  email_on_expert_rejected: boolean;
  email_on_order_updated: boolean;
  email_on_bidding_finished: boolean;
  email_on_chat_message: boolean;
  email_on_question_asked: boolean;
  email_on_question_answered: boolean;
  email_on_new_blog_post: boolean;
  notify_telegram_enabled: boolean;
}

export interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: Role;
  email_preferences: EmailPreferences;
}

export const getProfile = () => apiJson<Profile>("/settings/profile");

export const updateProfile = (fields: { first_name?: string; last_name?: string; phone?: string }) =>
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
