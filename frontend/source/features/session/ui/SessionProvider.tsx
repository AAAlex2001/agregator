"use client";

import { useEffect, useReducer } from "react";
import { usePathname } from "next/navigation";
import type { UserProfile } from "@/source/entities/user";
import { fetchSessionUser } from "../api/session.api";
import { SessionContext } from "../model/context";
import type { SessionRole } from "../model/types";
import { initialSessionState, sessionReducer } from "../model/reducer";
import { getRouteSessionRole, normalizeSessionRole } from "../model/sessionRole";

interface SessionProviderProps {
  initialRole?: SessionRole | null;
  children: React.ReactNode;
}

export function SessionProvider({ initialRole = null, children }: SessionProviderProps) {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);
  const pathname = usePathname();
  const routeRole = getRouteSessionRole(pathname);

  const reload = async () => {
    dispatch({ type: "LOADING" });
    try {
      const user = await fetchSessionUser();
      dispatch({ type: "SUCCESS", user });
    } catch (error) {
      dispatch({
        type: "ERROR",
        error: error instanceof Error ? error.message : "Не удалось загрузить сессию",
      });
    }
  };

  const setUser = (user: UserProfile | null) => {
    dispatch({ type: "SET_USER", user });
  };

  const mergeUser = (patch: Partial<UserProfile>) => {
    dispatch({ type: "MERGE_USER", patch });
  };

  useEffect(() => {
    void reload();
  }, []);

  const resolvedRole = normalizeSessionRole(state.user?.role) ?? routeRole ?? initialRole;

  return (
    <SessionContext.Provider value={{ ...state, resolvedRole, reload, setUser, mergeUser }}>
      {children}
    </SessionContext.Provider>
  );
}
