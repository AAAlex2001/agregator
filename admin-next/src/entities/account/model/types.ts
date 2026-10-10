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

export const ACCOUNT_ROLE_TONES: Record<AccountRole, BadgeTone> = {
  CUSTOMER: "info",
  EXPERT: "accent",
  LICENSE_HOLDER: "success",
};
