import type { CompanySuggestion } from "@/entities/company";

/** Организация, от которой подаётся отклик: введённый текст и выбранные реквизиты. */
export interface CompanyChoice {
  name: string;
  company: CompanySuggestion | null;
}

/** Переходы после успешного отклика и при отсутствии подходящей подписки. */
export interface RespondCallbacks {
  onResponded: () => void;
  onSubscriptionRequired: () => void;
}