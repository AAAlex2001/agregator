"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "@/source/features/session";
import { getUsefulLinks } from "./links";

export type DrawerAnchor = { left: number; top: number };

interface UsefulLinksContextValue {
  isAvailable: boolean;
  isOpen: boolean;
  anchor: DrawerAnchor | null;
  open: (anchor?: DrawerAnchor | null) => void;
  close: () => void;
}

const UsefulLinksContext = createContext<UsefulLinksContextValue | null>(null);

export function UsefulLinksProvider({ children }: { children: React.ReactNode }) {
  const { role } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<DrawerAnchor | null>(null);

  const value: UsefulLinksContextValue = {
    isAvailable: getUsefulLinks(role).length > 0,
    isOpen,
    anchor,
    open: (next = null) => {
      setAnchor(next ?? null);
      setIsOpen(true);
    },
    close: () => setIsOpen(false),
  };

  return <UsefulLinksContext.Provider value={value}>{children}</UsefulLinksContext.Provider>;
}

export function useUsefulLinks(): UsefulLinksContextValue {
  const ctx = useContext(UsefulLinksContext);
  if (!ctx) {
    return { isAvailable: false, isOpen: false, anchor: null, open: () => {}, close: () => {} };
  }
  return ctx;
}
