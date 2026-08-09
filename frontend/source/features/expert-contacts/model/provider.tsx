"use client";

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import {
  expertContactsReducer,
  initialExpertContactsState,
  type ExpertContactsAction,
} from "./reducer";
import type { ExpertContactsState } from "./types";

const ExpertContactsContext = createContext<{
  state: ExpertContactsState;
  dispatch: Dispatch<ExpertContactsAction>;
} | undefined>(undefined);

export function ExpertContactsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(expertContactsReducer, initialExpertContactsState);

  return (
    <ExpertContactsContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpertContactsContext.Provider>
  );
}

export function useExpertContactsContext() {
  const ctx = useContext(ExpertContactsContext);
  if (!ctx) {
    throw new Error("useExpertContactsContext must be used within ExpertContactsProvider");
  }
  return ctx;
}
