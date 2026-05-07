"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface SidebarMobileValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const Ctx = createContext<SidebarMobileValue | null>(null);

export function SidebarMobileProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <Ctx.Provider
      value={{
        isOpen,
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        toggle: () => setIsOpen((p) => !p),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useSidebarMobile(): SidebarMobileValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return { isOpen: false, open: () => {}, close: () => {}, toggle: () => {} };
  }
  return ctx;
}
