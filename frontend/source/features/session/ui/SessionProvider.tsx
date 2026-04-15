"use client";

import { useEffect, useReducer } from "react";
import type { UserProfile } from "@/source/entities/user";
import { fetchSessionUser } from "../api/session.api";
import { SessionContext } from "../model/context";
import { initialSessionState, sessionReducer } from "../model/reducer";

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [state, dispatch] = useReducer(sessionReducer, initialSessionState);

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

  return (
    <SessionContext.Provider value={{ ...state, reload, setUser, mergeUser }}>
      {children}
    </SessionContext.Provider>
  );
}
