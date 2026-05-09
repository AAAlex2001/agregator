"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useSession } from "@/source/features/session";

interface DrawerContextValue {
  isAvailable: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

interface ProviderProps {
  children: React.ReactNode;
}

export function LicenseHoldersDrawerProvider({ children }: ProviderProps) {
  const { role } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo<DrawerContextValue>(
    () => ({ isAvailable: role === "EXPERT", isOpen, open, close }),
    [role, isOpen, open, close],
  );

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useLicenseHoldersDrawer(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    return { isAvailable: false, isOpen: false, open: () => {}, close: () => {} };
  }
  return ctx;
}
