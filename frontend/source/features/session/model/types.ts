import type { UserProfile } from "@/source/entities/user";

export type SessionRole = "CUSTOMER" | "EXPERT";

export interface SessionState {
  user: UserProfile | null;
  role: SessionRole | null;
  isLoading: boolean;
  error: string | null;
}

export interface SessionContextValue extends SessionState {
  reload: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  mergeUser: (patch: Partial<UserProfile>) => void;
}

export type SessionAction =
  | { type: "LOADING" }
  | { type: "SUCCESS"; user: UserProfile | null; role: SessionRole | null }
  | { type: "ERROR"; error: string | null }
  | { type: "SET_USER"; user: UserProfile | null; role: SessionRole | null }
  | { type: "SET_ROLE"; role: SessionRole | null }
  | { type: "MERGE_USER"; patch: Partial<UserProfile>; role?: SessionRole | null };
