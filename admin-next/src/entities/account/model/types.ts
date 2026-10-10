import type { BadgeTone } from "@/shared/ui/badge";

export type AccountRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

export type Account = {
  id: number;
  role: AccountRole;
  name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  inn: string | null;
  is_active: boolean;
  created_at: string;
};

export type Company = {
  name: string;
  inn: string | null;
  kpp: string | null;
  ogrn: string | null;
  status: string | null;
  registration_date: string | null;
  manager: string | null;
  address: string | null;
  okved: string | null;
};

export type AccountDetail = {
  id: number;
  role: AccountRole;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  email_verified: boolean;
  phone: string | null;
  inn: string | null;
  company: Company | null;
  is_active: boolean;
  has_telegram: boolean;
  orders_count: number;
  responses_count: number;
  subscription_name: string | null;
  subscription_expires_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AccountChanges = {
  first_name: string;
  last_name: string;
  email: string;
  email_verified: boolean;
  phone: string;
  inn: string;
  is_active: boolean;
};

export type AccountList = {
  items: Account[];
  total: number;
};

export type AccountListQuery = {
  role: string;
  query: string;
};

export const ACCOUNT_ROLE_LABELS: Record<AccountRole, string> = {
  CUSTOMER: "Заказчик",
  EXPERT: "Исполнитель",
  LICENSE_HOLDER: "Держатель документов",
};

export const COMPANY_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Действующая",
  LIQUIDATING: "Ликвидируется",
  LIQUIDATED: "Ликвидирована",
  BANKRUPT: "Банкротство",
  REORGANIZING: "Реорганизация",
};

export const ACCOUNT_ROLE_TONES: Record<AccountRole, BadgeTone> = {
  CUSTOMER: "info",
  EXPERT: "accent",
  LICENSE_HOLDER: "success",
};
