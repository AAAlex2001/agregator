"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface SidebarMobileValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarMobileContext = createContext<SidebarMobileValue | null>(null);

/** Управляет мобильным меню и закрывает его при переходе на другую страницу. */
export function SidebarMobileProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [openedPath, setOpenedPath] = useState<string | null>(null);
  const isOpen = openedPath === pathname;

  if (openedPath !== null && openedPath !== pathname) {
    setOpenedPath(null);
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1440px)");

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpenedPath(null);
    }

    function handleViewportChange(event: MediaQueryListEvent) {
      if (event.matches) setOpenedPath(null);
    }

    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", handleViewportChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleViewportChange);
    };
  }, [isOpen]);

  return (
    <SidebarMobileContext.Provider
      value={{
        isOpen,
        open: () => setOpenedPath(pathname),
        close: () => setOpenedPath(null),
        toggle: () => setOpenedPath((current) => current === pathname ? null : pathname),
      }}
    >
      {children}
    </SidebarMobileContext.Provider>
  );
}

export function useSidebarMobile(): SidebarMobileValue {
  const context = useContext(SidebarMobileContext);
  if (!context) {
    return { isOpen: false, open: () => {}, close: () => {}, toggle: () => {} };
  }
  return context;
}
