export type UserRole = "CUSTOMER" | "EXPERT";

export interface LoginFormData {
  email: string;
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
