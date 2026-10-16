"use client";

import { useEffect, useRef, useState } from "react";
import type {
  ResponseSort as ResponseSortValue,
  ResponseSortDirection,
  ResponseSortField,
} from "@/entities/response";
import { SortPill } from "@/shared/ui/sort-pill";
import { RESPONSE_SORT_OPTIONS } from "../../config/options";
import styles from "./style.module.scss";

/** Выбранный порядок откликов и его изменение. */
interface ResponseSortProps {
  sort: ResponseSortValue;
  onChange: (sort: ResponseSortValue) => void;
}

/** Меняет порядок откликов по дате, цене или рейтингу исполнителя. */
export function ResponseSort({ sort, onChange }: ResponseSortProps) {
  const [openField, setOpenField] = useState<ResponseSortField | null>(null);
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

  /** Открывает выбранное поле или закрывает его повторным нажатием. */
  function toggleField(field: ResponseSortField) {
    setOpenField(openField === field ? null : field);
  }

  /** Закрывает меню после выбора порядка. */
  function closeMenu() {
    setOpenField(null);
  }

  /** Применяет направление выбранного поля или возвращает порядок сервера. */
  function changeSort(field: ResponseSortField, direction: ResponseSortDirection | null) {
    if (direction) {
      onChange({ field, direction });
      return;
    }

    onChange({ field: null, direction: null });
  }

  return (
    <div
      className={styles.row}
      ref={rowRef}
    >
      <span className={styles.title}>Сортировка:</span>
      {RESPONSE_SORT_OPTIONS.map((option) => (
        <SortPill
          key={option.field}
          label={option.label}
          descLabel={option.descendingLabel}
          ascLabel={option.ascendingLabel}
          isActive={sort.field === option.field}
          isOpen={openField === option.field}
          sortDir={sort.direction}
          onToggle={() => toggleField(option.field)}
          onClose={closeMenu}
          onChange={(direction) => changeSort(option.field, direction)}
        />
      ))}
    </div>
  );
}
