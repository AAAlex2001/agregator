import type { DirectionCode } from "@/entities/direction";
import type { UserRole } from "@/entities/user";
import type { RegistrationAccount } from "./account";
import type { RegistrationCompany } from "./company";
import type { CustomerRegistration } from "./customer";
import type { ExpertRegistration } from "./expert";
import type { HolderRegistration } from "./holder";

/** Роль и направление, выбранные на странице до открытия регистрации. */
export interface RegistrationPreset {
  role: UserRole;
  direction?: DirectionCode | null;
}

/** Данные отдельных частей формы и состояние общей отправки регистрации. */
export interface RegisterState {
  role: UserRole;
  account: RegistrationAccount;
  company: RegistrationCompany;
  customer: CustomerRegistration;
  expert: ExpertRegistration;
  holder: HolderRegistration;
  isSubmitting: boolean;
}

/** Изменения частей формы; каждая часть передаёт свои типизированные значения. */
export type RegisterAction =
  | { type: "role/changed"; role: UserRole }
  | { type: "account/changed"; account: RegistrationAccount }
  | { type: "company/changed"; company: RegistrationCompany }
  | { type: "customer/changed"; customer: CustomerRegistration }
  | { type: "expert/changed"; expert: ExpertRegistration }
  | { type: "holder/changed"; holder: HolderRegistration }
  | { type: "registration/started" }
  | { type: "registration/finished" };

/** Начальный выбор и события формы для окна авторизации. */
export interface RegisterFormOptions {
  preset: RegistrationPreset | null;
  onRegistered: (email: string, role: UserRole) => void;
  onBusyChange?: (isBusy: boolean) => void;
}

