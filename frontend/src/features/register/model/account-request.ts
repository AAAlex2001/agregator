import { toRussianPhoneApiValue } from "@/shared/lib/phone";
import type { RegistrationAccount } from "./account";

/** Общие поля multipart payload регистрации в именах API. */
export interface RegistrationAccountRequest {
  email: string;
  password: string;
  password_confirm: string;
  phone?: string;
  privacy_consent: boolean;
  terms_consent: boolean;
  personal_data_consent: boolean;
}

/** Подготавливает контакты и согласия к отправке для любой роли. */
export function getAccountRequestFields(account: RegistrationAccount): RegistrationAccountRequest {
  return {
    email: account.email.trim(),
    password: account.password,
    password_confirm: account.passwordConfirmation,
    phone: toRussianPhoneApiValue(account.phone) || undefined,
    privacy_consent: account.privacyAccepted,
    terms_consent: account.termsAccepted,
    personal_data_consent: account.personalDataAccepted,
  };
}

