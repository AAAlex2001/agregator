"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "@/source/shared/ui/icons";
import s from "./filterDropdown.module.scss";

export interface FilterDropdownOption {
  value: string;
  title: string;
  short?: string;
}

interface Props {
  label: string;
  options: FilterDropdownOption[];
  selected: string[];
  onToggle: (value: string) => void;
}

export function FilterDropdown({ label, options, selected, onToggle }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className={s.wrap} ref={wrapRef}>
      <button
        type="button"
        className={open ? `${s.trigger} ${s.triggerOpen}` : s.trigger}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className={s.triggerLabel}>{label}</span>
        {selected.length > 0 && <span className={s.count}>{selected.length}</span>}
        <ChevronIcon className={open ? `${s.chevron} ${s.chevronOpen}` : s.chevron} color="currentColor" />
      </button>

      {open && (
        <div className={s.panel} role="listbox" aria-label={label} aria-multiselectable="true">
          {options.map((option) => {
            const isActive = selected.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isActive}
                className={isActive ? `${s.option} ${s.optionActive}` : s.option}
                onClick={() => onToggle(option.value)}
              >
                {option.short && <span className={s.optionShort}>{option.short}</span>}
                <span className={s.optionTitle}>{option.title}</span>
                {isActive && (
                  <span className={s.optionCheck} aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
