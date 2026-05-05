import { ReactNode } from "react";

export type UserRole = "CUSTOMER" | "EXPERT";

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
  company_data?: Record<string, unknown> | null;
}

export interface RegisterResponse {
  id: number;
  role: UserRole;
  email?: string;
  phone?: string;
  created_at: string;
}
