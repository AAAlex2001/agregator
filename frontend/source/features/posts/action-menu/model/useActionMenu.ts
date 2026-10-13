"use client";

import { useEffect, useState, type RefObject } from "react";

/** Закрывает меню публикации по Escape и нажатию снаружи. */
export function useActionMenu(element: RefObject<HTMLElement | null>) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    function closeOutside(event: PointerEvent) {
      if (!element.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [element, open]);

  return {
    open,
    toggle: () => setOpen((current) => !current),
    close: () => setOpen(false),
  };
}
