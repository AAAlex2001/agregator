"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type AuthTab = "login" | "register";

interface AuthModalContextValue {
  openAuth: (tab?: AuthTab) => void;
  close: () => void;
  isOpen: boolean;
  tab: AuthTab;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; tab: AuthTab }>({
    open: false,
    tab: "login",
  });

  const openAuth = (tab: AuthTab = "login") => setState({ open: true, tab });
  const close = () => setState((prev) => ({ ...prev, open: false }));

  return (
    <AuthModalContext.Provider value={{ openAuth, close, isOpen: state.open, tab: state.tab }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
