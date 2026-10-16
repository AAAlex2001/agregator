"use client";

import { useEffect } from "react";
import type { Dispatch, RefObject } from "react";
import type { OrderSearchAction } from "./types";

/** Закрывает фильтры снаружи формы и блокирует фон под мобильной панелью. */
export function useFilterPanel(
  rootRef: RefObject<HTMLDivElement | null>,
  isOpen: boolean,
  dispatch: Dispatch<OrderSearchAction>,
) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    /** Закрывает фильтры после нажатия за пределами поискового блока. */
    function closeOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        dispatch({ type: "filters/closed" });
      }
    }

    document.addEventListener("pointerdown", closeOutside);

    return () => {
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [isOpen, rootRef, dispatch]);

  useEffect(() => {
    if (!isOpen || !window.matchMedia("(max-width: 767px)").matches) {
      return;
    }

    const body = document.body;
    const root = document.documentElement;
    const bodyOverflow = body.style.overflow;
    const rootOverflow = root.style.overflow;

    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      root.style.overflow = rootOverflow;
      body.style.overflow = bodyOverflow;
    };
  }, [isOpen]);
}
