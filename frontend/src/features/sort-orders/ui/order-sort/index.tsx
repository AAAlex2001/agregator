"use client";

import { useEffect, useRef, useState } from "react";
import { useChangeOrderSort, useOrderList } from "@/entities/order";
import type { OrderSortDirection, OrderSortField } from "@/entities/order";
import { SortPill } from "@/shared/ui/sort-pill";
import { ORDER_SORT_OPTIONS } from "../../config/options";
import styles from "./style.module.scss";

/** Меняет порядок заказов; открытие меню остаётся локальным состоянием интерфейса. */
export function OrderSort() {
  const { sort } = useOrderList();
  const changeOrderSort = useChangeOrderSort();
  const [openField, setOpenField] = useState<OrderSortField | null>(null);
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
  function toggleField(field: OrderSortField) {
    setOpenField(openField === field ? null : field);
  }

  /** Закрывает меню после выбора порядка. */
  function closeMenu() {
    setOpenField(null);
  }

  /** Применяет направление выбранного поля или возвращает исходный порядок. */
  function changeSort(field: OrderSortField, direction: OrderSortDirection | null) {
    if (direction) {
      void changeOrderSort({ field, direction });
      return;
    }

    void changeOrderSort({ field: null, direction: null });
  }

  return (
    <div
      className={styles.row}
      ref={rowRef}
    >
      <span className={styles.title}>Сортировка:</span>
      {ORDER_SORT_OPTIONS.map((option) => (
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
