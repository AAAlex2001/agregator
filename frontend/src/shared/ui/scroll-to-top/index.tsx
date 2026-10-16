"use client";

import { useEffect, useState } from "react";
import { ArrowIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Показывает кнопку возврата наверх после прокрутки страницы на 400 пикселей. */
export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    /** Проверяет текущую прокрутку при подключении и каждом scroll-событии. */
    function updateVisibility() {
      setIsVisible(window.scrollY > 400);
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });

    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  /** Плавно возвращает страницу к началу. */
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.button}
      aria-label="Наверх"
      onClick={scrollToTop}
    >
      <span className={styles.icon}>
        <ArrowIcon color="var(--color-orange-soft)" />
      </span>
    </button>
  );
}
