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
  id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  role: Role;
  inn: string | null;
  company_data: { value?: string } | null;
  email_preferences: EmailPreferences;
  notify_order_types: string[];
}

export interface AvailableRole {
  role: Role;
  email_verified: boolean;
}

export interface UpdateProfileInput {
  first_name?: string;
  last_name?: string;
  phone?: string;
}
