import type { EmailPreferences } from "@/entities/user";

/** Настройки для отключения всех десяти видов почтовых событий. */
export const DISABLED_EMAIL_PREFERENCES: EmailPreferences = {
  email_on_response_created: false,
  email_on_response_updated: false,
  email_on_expert_rejected: false,
  email_on_order_updated: false,
  email_on_bidding_finished: false,
  email_on_chat_message: false,
  email_on_question_asked: false,
  email_on_question_answered: false,
  email_on_new_blog_post: false,
  email_on_labor_listing: false,
};
