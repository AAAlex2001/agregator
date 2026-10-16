"use client";

import { useEffect, useRef, useState } from "react";
import type { ExpertSort, ExpertSortField } from "@/entities/expert";
import { Skeleton } from "@/shared/ui/skeleton";
import { SortPill } from "@/shared/ui/sort-pill";
import type { SortDirection } from "@/shared/ui/sort-pill";
import styles from "./style.module.scss";

/** Выбранный порядок рейтинга и состояние его загрузки. */
interface ExpertsSortProps {
  sort: ExpertSort;
  isLoading: boolean;
  onChange: (sort: ExpertSort) => void;
}

/** Меняет порядок исполнителей по рейтингу, заказам и отзывам. */
export function ExpertsSort({ sort, isLoading, onChange }: ExpertsSortProps) {
  const [openField, setOpenField] = useState<ExpertSortField | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openField) {
      return;
    }

    /** Закрывает меню при нажатии за пределами строки сортировки. */
    function closeOutside(event: MouseEvent) {
      if (event.target instanceof Node && !rowRef.current?.contains(event.target)) {
        setOpenField(null);
      }
    }

    document.addEventListener("mousedown", closeOutside);

    return () => {
      document.removeEventListener("mousedown", closeOutside);
    };
  }, [openField]);

  /** Открывает варианты поля или закрывает их повторным нажатием. */
  function toggleField(field: ExpertSortField) {
    setOpenField(openField === field ? null : field);
  }

  /** Скрывает меню после выбора порядка. */
  function closeMenu() {
    setOpenField(null);
  }

  /** Применяет направление поля или возвращает порядок сервера. */
  function changeField(field: ExpertSortField, direction: SortDirection | null) {
    onChange({
      field: direction ? field : null,
      direction,
    });
  }

  if (isLoading) {
    return (
      <div
        className={styles.row}
        aria-hidden="true"
      >
        <span className={styles.title}>Сортировка:</span>
        <Skeleton
          className={styles.pillSkeleton}
          rounded="pill"
        />
        <Skeleton
          className={styles.pillSkeleton}
          rounded="pill"
        />
        <Skeleton
          className={styles.pillSkeleton}
          rounded="pill"
        />
      </div>
    );
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
        isActive={sort.field === "rating"}
        isOpen={openField === "rating"}
        sortDir={sort.direction}
        onToggle={() => toggleField("rating")}
        onClose={closeMenu}
        onChange={(direction) => changeField("rating", direction)}
      />
      <SortPill
        label="Количество заказов"
        descLabel="Сначала больше заказов"
        ascLabel="Сначала меньше заказов"
        isActive={sort.field === "completed_orders"}
        isOpen={openField === "completed_orders"}
        sortDir={sort.direction}
        onToggle={() => toggleField("completed_orders")}
        onClose={closeMenu}
        onChange={(direction) => changeField("completed_orders", direction)}
      />
      <SortPill
        label="Количество отзывов"
        descLabel="Сначала больше отзывов"
        ascLabel="Сначала меньше отзывов"
        isActive={sort.field === "review_count"}
        isOpen={openField === "review_count"}
        sortDir={sort.direction}
        onToggle={() => toggleField("review_count")}
        onClose={closeMenu}
        onChange={(direction) => changeField("review_count", direction)}
      />
    </div>
  );
}
