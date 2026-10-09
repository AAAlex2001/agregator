"use client";

import cn from "classnames";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
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

/** Выпадающий список со своей панелью: подсветка, галочка выбранного, управление стрелками, Enter и Escape. */
const Select = ({ value, options, onChange, ariaLabel, size = "md", className }: SelectProps) => {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex];

  useEffect(() => {
    if (!open) return;

    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", close);

    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const show = () => {
    setActive(selectedIndex);
    setOpen(true);
  };

  const choose = (option: Option) => {
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape" || event.key === "Tab") {
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        show();
        return;
      }

      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((index) => (index + step + options.length) % options.length);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (open) choose(options[active]);
      else show();
    }
  };

  return (
    <div ref={rootRef} className={cn(styles.root, size === "sm" && styles.small, className)}>
      <button
        type="button"
        className={cn(styles.trigger, open && styles.opened)}
        role="combobox"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.value}>{selected?.label}</span>

        <ChevronDownIcon className={styles.chevron} />
      </button>

      {open && (
        <ul id={listId} role="listbox" className={styles.list}>
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={cn(
                styles.option,
                index === active && styles.highlighted,
                option.value === value && styles.selected,
              )}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(option)}
            >
              <span className={styles.label}>{option.label}</span>

              {option.value === value && <CheckIcon className={styles.check} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
