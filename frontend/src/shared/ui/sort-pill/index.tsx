"use client";

import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import { ChevronIcon } from "@/shared/ui/icons";
import type { SortPillProps } from "./model/types";
import { SortOption } from "./ui/sort-option";
import { SortPillCloseIcon } from "./ui/sort-pill-close-icon";
import styles from "./style.module.scss";

/** Положение выпадающего меню относительно окна браузера. */
interface MenuPosition {
  top: number;
  left: number;
}

/** Открывает меню сортировки и передаёт выбранное направление родителю. */
export function SortPill({
  label,
  ascLabel,
  descLabel,
  isActive,
  isOpen,
  sortDir,
  onToggle,
  onClose,
  onChange,
}: SortPillProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  /** Располагает меню на четыре пикселя ниже кнопки. */
  function updatePosition() {
    const bounds = buttonRef.current?.getBoundingClientRect();

    if (bounds) {
      setPosition({
        top: bounds.bottom + 4,
        left: bounds.left,
      });
    }
  }

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  /** Вычисляет положение меню перед его открытием. */
  function toggleMenu() {
    if (!isOpen) {
      updatePosition();
    }

    onToggle();
  }

  /** Сбрасывает сортировку, не переключая открытое меню. */
  function resetSort(event: MouseEvent<HTMLSpanElement>) {
    event.stopPropagation();
    onChange(null);
  }

  /** Возвращает исходный порядок и закрывает меню. */
  function selectDefault() {
    onChange(null);
    onClose();
  }

  /** Выбирает убывающий порядок и закрывает меню. */
  function selectDescending() {
    onChange("desc");
    onClose();
  }

  /** Выбирает возрастающий порядок и закрывает меню. */
  function selectAscending() {
    onChange("asc");
    onClose();
  }

  /** Не даёт клику внутри портала закрыть меню как внешнему клику. */
  function stopMenuMouseDown(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <div className={styles.wrap}>
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          styles.pill,
          (isActive || isOpen) && styles.pillActive,
        )}
        onClick={toggleMenu}
      >
        <span>{label}</span>
        {isActive ? (
          <span
            className={styles.close}
            role="button"
            onClick={resetSort}
          >
            <SortPillCloseIcon />
          </span>
        ) : (
          <ChevronIcon
            className={cn(
              styles.chevron,
              isOpen && styles.chevronOpen,
            )}
            color="var(--color-text-charcoal)"
          />
        )}
      </button>

      {isOpen && position && typeof document !== "undefined" && createPortal(
        <div
          className={styles.menu}
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
          }}
          onMouseDown={stopMenuMouseDown}
        >
          <SortOption
            label="По умолчанию"
            isChecked={!isActive}
            onSelect={selectDefault}
          />
          <SortOption
            label={descLabel}
            isChecked={isActive && sortDir === "desc"}
            onSelect={selectDescending}
          />
          <SortOption
            label={ascLabel}
            isChecked={isActive && sortDir === "asc"}
            onSelect={selectAscending}
          />
        </div>,
        document.body,
      )}
    </div>
  );
}

export type { SortDirection } from "./model/types";
