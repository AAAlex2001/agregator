"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "@/source/features/session";

interface ExpertHelpContextValue {
  isAvailable: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ExpertHelpContext = createContext<ExpertHelpContextValue | null>(null);

export function ExpertHelpProvider({ children }: { children: React.ReactNode }) {
  const { role } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const value: ExpertHelpContextValue = {
    isAvailable: role === "EXPERT",
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <ExpertHelpContext.Provider value={value}>{children}</ExpertHelpContext.Provider>;
}

export function useExpertHelpDrawer(): ExpertHelpContextValue {
  const ctx = useContext(ExpertHelpContext);
  if (!ctx) {
    return { isAvailable: false, isOpen: false, open: () => {}, close: () => {} };
  }
  return ctx;
}
