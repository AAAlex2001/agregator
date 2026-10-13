import type { UserProfile, UserRole } from "@/source/entities/user";

export interface LoginCredentials {
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginResponse {
  id: number;
  role: UserRole;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export interface AvailableRole {
  role: UserRole;
  email_verified: boolean;
}

export interface SessionState {
  user: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  error: string | null;
}

export type SessionAction =
  | { type: "load/start" }
  | { type: "load/success"; user: UserProfile | null }
  | { type: "load/error"; error: string }
  | { type: "user/set"; user: UserProfile | null };

export interface SessionContextValue extends SessionState {
  reload: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
}
