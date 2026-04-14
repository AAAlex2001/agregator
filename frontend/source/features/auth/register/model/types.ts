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

export interface RegisterFormData {
  role: UserRole;
  login: string;
  password: string;
  repeatPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResponse {
  id: number;
  role: UserRole;
  email?: string;
  phone?: string;
  created_at: string;
}
