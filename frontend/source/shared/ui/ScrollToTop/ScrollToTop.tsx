"use client";

import { useEffect, useState } from "react";
import { ArrowIcon } from "@/source/shared/ui/icons";
import s from "./ScrollToTop.module.scss";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className={s.button}
      aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <span className={s.icon}>
        <ArrowIcon color="#FFDDA9" />
      </span>
    </button>
  );
}
