export type UserRole = "CUSTOMER" | "EXPERT";

export interface LoginState {
  login: string;
  password: string;
  role: UserRole;
  isLoading: boolean;
  error: string | null;
}

type LoginField = "login" | "password";

export type LoginAction =
  | { type: "SET_FIELD"; field: LoginField; value: string }
  | { type: "SET_ROLE"; payload: UserRole }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

export interface LoginFormData {
  login: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  id: number;
  role: UserRole;
  email: string | null;
  phone: string | null;
  created_at: string;
}
