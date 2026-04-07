export type UserRole = "CUSTOMER" | "EXPERT";

export interface LoginFormData {
  login: string;
  password: string;
  role: UserRole;
}

export interface LoginState {
  login: string;
  password: string;
  role: UserRole;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  id: number;
  role: UserRole;
  email: string | null;
  phone: string | null;
  created_at: string;
}
