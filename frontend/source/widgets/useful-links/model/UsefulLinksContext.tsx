"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "@/source/features/session";
import { getUsefulLinks } from "./links";

interface UsefulLinksContextValue {
  isAvailable: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const UsefulLinksContext = createContext<UsefulLinksContextValue | null>(null);

export function UsefulLinksProvider({ children }: { children: React.ReactNode }) {
  const { role } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const value: UsefulLinksContextValue = {
    isAvailable: getUsefulLinks(role).length > 0,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };

  return <UsefulLinksContext.Provider value={value}>{children}</UsefulLinksContext.Provider>;
}

export function useUsefulLinks(): UsefulLinksContextValue {
  const ctx = useContext(UsefulLinksContext);
  if (!ctx) {
    return { isAvailable: false, isOpen: false, open: () => {}, close: () => {} };
  }
  return ctx;
}
