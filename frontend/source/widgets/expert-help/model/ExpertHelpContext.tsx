"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "@/source/features/session";

export type DrawerAnchor = { left: number; top: number };

interface ExpertHelpContextValue {
  isAvailable: boolean;
  isOpen: boolean;
  anchor: DrawerAnchor | null;
  open: (anchor?: DrawerAnchor | null) => void;
  close: () => void;
}

const ExpertHelpContext = createContext<ExpertHelpContextValue | null>(null);

export function ExpertHelpProvider({ children }: { children: React.ReactNode }) {
  const { role } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<DrawerAnchor | null>(null);

  const value: ExpertHelpContextValue = {
    isAvailable: role === "EXPERT",
    isOpen,
    anchor,
    open: (next = null) => {
      setAnchor(next ?? null);
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  };

  return <ExpertHelpContext.Provider value={value}>{children}</ExpertHelpContext.Provider>;
}

export function useExpertHelpDrawer(): ExpertHelpContextValue {
  const ctx = useContext(ExpertHelpContext);
  if (!ctx) {
    return { isAvailable: false, isOpen: false, anchor: null, open: () => {}, close: () => {} };
  }
  return ctx;
}
