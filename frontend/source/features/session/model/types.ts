import type { UserProfile } from "@/source/entities/user";

export type SessionRole = "CUSTOMER" | "EXPERT";

export interface SessionState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface SessionContextValue extends SessionState {
  resolvedRole: SessionRole | null;
  reload: () => Promise<void>;
  setUser: (user: UserProfile | null) => void;
  mergeUser: (patch: Partial<UserProfile>) => void;
}

export type SessionAction =
  | { type: "LOADING" }
  | { type: "SUCCESS"; user: UserProfile | null }
  | { type: "ERROR"; error: string | null }
  | { type: "SET_USER"; user: UserProfile | null }
  | { type: "MERGE_USER"; patch: Partial<UserProfile> };
