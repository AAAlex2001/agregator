export type UserRole = "CUSTOMER" | "EXPERT";

export interface LoginState {
  inn: string;
  password: string;
  isLoading: boolean;
  error: string | null;
}

type LoginField = "inn" | "password";

export type LoginAction =
  | { type: "SET_FIELD"; field: LoginField; value: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

export interface LoginFormData {
  inn: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  role: UserRole;
  inn: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
}
