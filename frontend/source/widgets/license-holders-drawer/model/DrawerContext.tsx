"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "@/source/features/session";

interface DrawerContextValue {
  isAvailable: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function LicenseHoldersDrawerProvider({ children }: { children: React.ReactNode }) {
  const { role } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const value: DrawerContextValue = {
    isAvailable: role === "EXPERT",
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useLicenseHoldersDrawer(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    return { isAvailable: false, isOpen: false, open: () => {}, close: () => {} };
  }
  return ctx;
}
