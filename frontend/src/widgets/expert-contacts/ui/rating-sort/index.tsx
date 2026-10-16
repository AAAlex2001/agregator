"use client";

import { useEffect, useRef, useState } from "react";
import { SortPill } from "@/shared/ui/sort-pill";
import type { SortDirection } from "@/shared/ui/sort-pill";
import styles from "./style.module.scss";

/** Выбранный порядок каталога по рейтингу. */
interface RatingSortProps {
  direction: SortDirection | null;
  onChange: (direction: SortDirection | null) => void;
}

/** Меняет порядок исполнителей каталога по рейтингу. */
export function RatingSort({ direction, onChange }: RatingSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    /** Закрывает меню при нажатии за пределами строки сортировки. */
    function closeOutside(event: MouseEvent) {
      if (event.target instanceof Node && !rowRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOutside);

    return () => {
      document.removeEventListener("mousedown", closeOutside);
    };
  }, [isOpen]);

  /** Скрывает меню после выбора порядка. */
  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div
      className={styles.row}
      ref={rowRef}
    >
      <span className={styles.title}>Сортировка:</span>
      <SortPill
        label="Рейтинг"
        descLabel="Сначала с высоким рейтингом"
        ascLabel="Сначала с низким рейтингом"
        isActive={direction !== null}
        isOpen={isOpen}
        sortDir={direction}
        onToggle={() => setIsOpen(!isOpen)}
        onClose={closeMenu}
        onChange={onChange}
      />
    </div>
  );
}
