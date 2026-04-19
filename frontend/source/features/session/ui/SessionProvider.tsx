"use client";

import { useEffect, useReducer, useState } from "react";
import { usePathname } from "next/navigation";
import type { UserProfile } from "@/source/entities/user";
import { fetchSessionUser } from "../api/session.api";
import { SessionContext } from "../model/context";
import type { SessionRole } from "../model/types";
import { initialSessionState, sessionReducer } from "../model/reducer";
import {
  getRouteSessionRole,
  normalizeSessionRole,
  readCachedSessionRole,
  writeCachedSessionRole,
} from "../model/sessionRole";

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);
  const [cachedRole, setCachedRole] = useState<SessionRole | null>(null);
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
    setCachedRole(readCachedSessionRole());
    void reload();
  }, []);

  useEffect(() => {
    if (!routeRole || routeRole === cachedRole) return;

    setCachedRole(routeRole);
    writeCachedSessionRole(routeRole);
  }, [routeRole, cachedRole]);

  useEffect(() => {
    const nextRole = normalizeSessionRole(state.user?.role);

    if (nextRole) {
      if (nextRole !== cachedRole) {
        setCachedRole(nextRole);
        writeCachedSessionRole(nextRole);
      }
      return;
    }

    if (!state.isLoading && state.error === null && cachedRole) {
      setCachedRole(null);
      writeCachedSessionRole(null);
    }
  }, [state.user, state.isLoading, state.error, cachedRole]);

  const resolvedRole = routeRole ?? normalizeSessionRole(state.user?.role) ?? cachedRole;

  return (
    <SessionContext.Provider value={{ ...state, resolvedRole, reload, setUser, mergeUser }}>
      {children}
    </SessionContext.Provider>
  );
}
