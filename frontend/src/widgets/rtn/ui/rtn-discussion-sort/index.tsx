"use client";

import { useEffect, useRef, useState } from "react";
import type { RtnCommentSort, RtnCommentSortField } from "@/entities/rtn";
import { SortPill } from "@/shared/ui/sort-pill";
import type { SortDirection } from "@/shared/ui/sort-pill";
import styles from "./style.module.scss";

/** Выбранный порядок профессионального обсуждения. */
interface RtnDiscussionSortProps {
  sort: RtnCommentSort;
  onChange: (sort: RtnCommentSort) => void;
}

/** Переключает порядок комментариев по полезности, дате и роли автора. */
export function RtnDiscussionSort({ sort, onChange }: RtnDiscussionSortProps) {
  const [openField, setOpenField] = useState<RtnCommentSortField | null>(null);
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
  function toggleField(field: RtnCommentSortField) {
    setOpenField(openField === field ? null : field);
  }

  /** Скрывает меню после выбора порядка. */
  function closeMenu() {
    setOpenField(null);
  }

  /** Применяет направление поля или возвращает исходный порядок. */
  function changeField(field: RtnCommentSortField, dir: SortDirection | null) {
    onChange({
      by: dir ? field : null,
      dir,
    });
  }

  return (
    <div
      className={styles.row}
      ref={rowRef}
    >
      <span className={styles.title}>Сортировка:</span>
      <SortPill
        label="Полезность"
        descLabel="Сначала полезные"
        ascLabel="Сначала менее полезные"
        isActive={sort.by === "useful_count"}
        isOpen={openField === "useful_count"}
        sortDir={sort.dir}
        onToggle={() => toggleField("useful_count")}
        onClose={closeMenu}
        onChange={(dir) => changeField("useful_count", dir)}
      />
      <SortPill
        label="Дата"
        descLabel="Сначала новые"
        ascLabel="Сначала старые"
        isActive={sort.by === "created_at"}
        isOpen={openField === "created_at"}
        sortDir={sort.dir}
        onToggle={() => toggleField("created_at")}
        onClose={closeMenu}
        onChange={(dir) => changeField("created_at", dir)}
      />
      <SortPill
        label="Исполнители"
        descLabel="Сначала исполнители"
        ascLabel="Сначала не исполнители"
        isActive={sort.by === "is_expert"}
        isOpen={openField === "is_expert"}
        sortDir={sort.dir}
        onToggle={() => toggleField("is_expert")}
        onClose={closeMenu}
        onChange={(dir) => changeField("is_expert", dir)}
      />
    </div>
  );
}
