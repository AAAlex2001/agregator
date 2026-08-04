export type UserRole = "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";

export interface RegisterResponse {
  id: number;
  role: UserRole;
  email?: string;
  phone?: string;
  created_at: string;
}
