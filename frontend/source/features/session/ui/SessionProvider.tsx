"use client";

import { useEffect, useReducer } from "react";
import { usePathname } from "next/navigation";
import type { UserProfile } from "@/source/entities/user";
import { fetchSessionUser } from "../api/session.api";
import { SessionContext } from "../model/context";
import type { SessionRole } from "../model/types";
import { initialSessionState, sessionReducer } from "../model/reducer";
import { getRouteSessionRole, normalizeSessionRole, readSessionRoleFromCookie } from "../model/sessionRole";

interface SessionProviderProps {
  initialRole?: SessionRole | null;
  children: React.ReactNode;
}

export function SessionProvider({ initialRole = null, children }: SessionProviderProps) {
  const pathname = usePathname();
  const routeRole = getRouteSessionRole(pathname);
  const initialSessionRole = initialRole ?? routeRole ?? readSessionRoleFromCookie();
  const [state, dispatch] = useReducer(
    sessionReducer,
    initialSessionRole,
    (role) => ({ ...initialSessionState, role }),
  );

  useEffect(() => {
    if (routeRole && state.role !== routeRole) {
      dispatch({ type: "SET_ROLE", role: routeRole });
    }
  }, [routeRole, state.role]);

  const reload = async () => {
    dispatch({ type: "LOADING" });
    try {
      const user = await fetchSessionUser();
      dispatch({ type: "SUCCESS", user, role: normalizeSessionRole(user?.role) ?? state.role });
    } catch (error) {
      dispatch({
        type: "ERROR",
        error: error instanceof Error ? error.message : "Не удалось загрузить сессию",
      });
    }
  };

  const setUser = (user: UserProfile | null) => {
    dispatch({ type: "SET_USER", user, role: normalizeSessionRole(user?.role) });
  };

  const mergeUser = (patch: Partial<UserProfile>) => {
    dispatch({
      type: "MERGE_USER",
      patch,
      role: patch.role === undefined ? undefined : normalizeSessionRole(patch.role),
    });
  };

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const user = await fetchSessionUser();

        if (cancelled) {
          return;
        }

        dispatch({ type: "SUCCESS", user, role: normalizeSessionRole(user?.role) ?? initialSessionRole });
      } catch (error) {
        if (cancelled) {
          return;
        }

        dispatch({
          type: "ERROR",
          error: error instanceof Error ? error.message : "Не удалось загрузить сессию",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialSessionRole]);

  const resolvedRole = state.role;

  return (
    <SessionContext.Provider value={{ ...state, resolvedRole, reload, setUser, mergeUser }}>
      {children}
    </SessionContext.Provider>
  );
}
