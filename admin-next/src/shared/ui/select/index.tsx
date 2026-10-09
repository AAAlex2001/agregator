"use client";

import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import type { Option } from "@/shared/lib/options";
import { CheckIcon, ChevronDownIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type SelectProps = {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  ariaLabel?: string;
  size?: "md" | "sm";
  className?: string;
};

/** Выпадающий список со своей панелью: закрывается по клику снаружи и по Escape. */
const Select = ({ value, options, onChange, ariaLabel, size = "md", className }: SelectProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const choose = (option: Option) => {
    onChange(option.value);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={cn(styles.root, size === "sm" && styles.small, className)}
      onKeyDown={(event) => event.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        className={cn(styles.trigger, open && styles.opened)}
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span className={styles.value}>{options.find((option) => option.value === value)?.label}</span>

        <ChevronDownIcon className={styles.chevron} />
      </button>

      {open && (
        <div className={styles.list}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(styles.option, option.value === value && styles.selected)}
              onClick={() => choose(option)}
            >
              {option.label}

              {option.value === value && <CheckIcon className={styles.check} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
