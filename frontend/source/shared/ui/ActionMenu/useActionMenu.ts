"use client";

import { useEffect, useState, type RefObject } from "react";

/** Открытие меню; закрывается по Escape и нажатию за его пределами. */
export function useActionMenu(root: RefObject<HTMLElement | null>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [root, open]);

  return {
    open,
    toggle: () => setOpen(!open),
    close: () => setOpen(false),
  };
}
