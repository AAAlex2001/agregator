import { ReactNode } from "react";
import type { PartySuggestion } from "../api/partySuggestions.api";

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
  email: string;
  phone: string;
  inn: string;
  companyData?: PartySuggestion | null;
  password: string;
  repeatPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResponse {
  id: number;
  role: UserRole;
  inn?: string;
  email?: string;
  phone?: string;
  created_at: string;
}

/* ── Reducer ── */

export interface RegisterState {
  step: 1 | 2;
  selectedRole: number | null;
  openedCardId: number | null;
  email: string;
  phone: string;
  inn: string;
  innQuery: string;
  password: string;
  repeatPassword: string;
  firstName: string;
  lastName: string;
  isLoading: boolean;
  error: string | null;
}

type RegisterFormField = "email" | "phone" | "inn" | "innQuery" | "password" | "repeatPassword" | "firstName" | "lastName";

export type RegisterAction =
  | { type: "SELECT_ROLE"; payload: number }
  | { type: "TOGGLE_CARD"; payload: number }
  | { type: "SET_FIELD"; field: RegisterFormField; value: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };
