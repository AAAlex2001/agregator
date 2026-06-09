import type { CompanyData } from "./types";

export type UserRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

export interface RegisterApiPayload {
  role: UserRole;
  email: string;
  password: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  inn?: string;
  company_data?: CompanyData | null;
}

export interface RegisterResponse {
  id: number;
  role: UserRole;
  email?: string;
  phone?: string;
  created_at: string;
}
