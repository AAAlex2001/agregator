"use client";

import { useEffect, useReducer, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { UserProfile, UserRole } from "@/source/entities/user";
import { fetchSessionUser } from "../api/session.api";
import { initialSessionState, sessionReducer } from "../model/reducer";
import { readRoleCookie, roleFromPath, writeRoleCookie } from "../model/role";
import { SessionContext } from "../model/useSession";

const LOAD_FAILED = "Не удалось загрузить сессию";

interface SessionProviderProps {
  initialRole?: UserRole | null;
  children: ReactNode;
}

/** Держит текущего пользователя и его роль; роль запоминается в cookie, чтобы кабинет не мигал при следующем визите. */
export function SessionProvider({ initialRole = null, children }: SessionProviderProps) {
  const pathname = usePathname();
  const [state, dispatch] = useReducer(
    sessionReducer,
    initialRole ?? roleFromPath(pathname) ?? readRoleCookie(),
    initialSessionState,
  );

  useEffect(() => {
    let cancelled = false;
    fetchSessionUser()
      .then((user) => {
        if (!cancelled) dispatch({ type: "load/success", user });
      })
      .catch((reason) => {
        if (!cancelled) dispatch({ type: "load/error", error: reason instanceof Error ? reason.message : LOAD_FAILED });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    writeRoleCookie(state.role);
  }, [state.role]);

  const reload = async () => {
    dispatch({ type: "load/start" });
    try {
      dispatch({ type: "load/success", user: await fetchSessionUser() });
    } catch (reason) {
      dispatch({ type: "load/error", error: reason instanceof Error ? reason.message : LOAD_FAILED });
    }
  };

  const setUser = (user: UserProfile | null) => dispatch({ type: "user/set", user });

  return <SessionContext.Provider value={{ ...state, reload, setUser }}>{children}</SessionContext.Provider>;
}
