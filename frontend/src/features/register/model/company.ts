import type { CompanySuggestion } from "@/entities/company";

/** Введённое название и подтверждённая подсказкой организация для регистрации. */
export interface RegistrationCompany {
  query: string;
  selected: CompanySuggestion | null;
}

