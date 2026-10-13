"use client";

import { createContext, useContext } from "react";
import type { SessionContextValue } from "./types";

export const SessionContext = createContext<SessionContextValue | null>(null);

/** Текущий пользователь, его роль и способы обновить сессию. Работает только внутри SessionProvider. */
export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);
  if (!value) throw new Error("useSession must be used within SessionProvider");
  return value;
}
