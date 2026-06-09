import { ReactNode } from "react";
import type { CompanyData } from "@/source/entities/user";

export type UserRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

export const ROLE_ID_CUSTOMER = 1;
export const ROLE_ID_EXPERT = 2;
export const ROLE_ID_LICENSE_HOLDER = 3;

export interface Role {
  id: number;
  title: string;
  icon: ReactNode;
  expandedTitle: string;
  description: string[];
  photo: string;
}

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
