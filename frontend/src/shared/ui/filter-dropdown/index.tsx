"use client";

import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "@/shared/ui/icons";
import type { FilterDropdownProps } from "./model/types";
import { FilterOption } from "./ui/filter-option";
import styles from "./style.module.scss";

/** Раскрывает варианты фильтра и показывает количество выбранных значений. */
export function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    /** Закрывает список при нажатии за пределами фильтра. */
    function closeOutside(event: MouseEvent) {
      const container = containerRef.current;

      if (container && !container.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeOutside);

    return () => {
      document.removeEventListener("mousedown", closeOutside);
    };
  }, [isOpen]);

  /** Открывает или закрывает варианты фильтра. */
  function toggleDropdown() {
    setIsOpen((current) => !current);
  }

  return (
    <div
      className={styles.wrap}
      ref={containerRef}
    >
      <button
        type="button"
        className={cn(styles.trigger, {
          [styles.triggerOpen]: isOpen,
        })}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
      >
        <span className={styles.triggerLabel}>{label}</span>

        {selected.length > 0 && (
          <span className={styles.count}>{selected.length}</span>
        )}

        <ChevronIcon
          className={cn(styles.chevron, {
            [styles.chevronOpen]: isOpen,
          })}
          color="currentColor"
        />
      </button>

      {isOpen && (
        <div
          className={styles.panel}
          role="listbox"
          aria-label={label}
          aria-multiselectable="true"
        >
          {options.map((option) => (
            <FilterOption
              key={option.value}
              option={option}
              isSelected={selected.includes(option.value)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export type { FilterDropdownOption } from "./model/types";
