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

export interface RegistrationFormData {
  role: UserRole;
  login: string;
  password: string;
  repeatPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface RegistrationState {
  step: 1 | 2;
  selectedRole: number | null;
  openedCardId: number | null;
  login: string;
  password: string;
  repeatPassword: string;
  firstName: string;
  lastName: string;
  isLoading: boolean;
  error: string | null;
}

export interface RegistrationResponse {
  id: number;
  role: UserRole;
  email?: string;
  phone?: string;
  created_at: string;
}
