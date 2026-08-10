"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type AuthTab = "login" | "register";

export interface AuthPreset {
  role: "CUSTOMER" | "EXPERT" | "LICENSE_HOLDER";
  direction?:
    | "EXPERTISE"
    | "AUDIT_SUPB"
    | "RESEARCH"
    | "LABORATORY"
    | "TECH_DIAG"
    | "CADASTRAL"
    | "FORENSIC";
}

interface AuthModalContextValue {
  openAuth: (tab?: AuthTab, preset?: AuthPreset) => void;
  close: () => void;
  isOpen: boolean;
  tab: AuthTab;
  preset: AuthPreset | null;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; tab: AuthTab; preset: AuthPreset | null }>({
    open: false,
    tab: "login",
    preset: null,
  });

  const openAuth = (tab: AuthTab = "login", preset: AuthPreset | null = null) =>
    setState({ open: true, tab: preset ? "register" : tab, preset });
  const close = () => setState((prev) => ({ ...prev, open: false, preset: null }));

  return (
    <AuthModalContext.Provider
      value={{ openAuth, close, isOpen: state.open, tab: state.tab, preset: state.preset }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal(): AuthModalContextValue {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error("useAuthModal must be used within AuthModalProvider");
  return ctx;
}
