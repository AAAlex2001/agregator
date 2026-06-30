"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "@/source/features/session";

export type DrawerAnchor = { left: number; top: number };

interface DrawerContextValue {
  isAvailable: boolean;
  isOpen: boolean;
  anchor: DrawerAnchor | null;
  open: (anchor?: DrawerAnchor | null) => void;
  close: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function LicenseHoldersDrawerProvider({ children }: { children: React.ReactNode }) {
  const { role } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<DrawerAnchor | null>(null);

  const value: DrawerContextValue = {
    isAvailable: role === "EXPERT",
    isOpen,
    anchor,
    open: (next = null) => {
      setAnchor(next ?? null);
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  };

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useLicenseHoldersDrawer(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    return { isAvailable: false, isOpen: false, anchor: null, open: () => {}, close: () => {} };
  }
  return ctx;
}
