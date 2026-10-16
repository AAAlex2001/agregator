"use client";

import cn from "classnames";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronIcon } from "@/shared/ui/icons";
import type { SelectProps } from "./model/types";
import { SelectOptionButton } from "./ui/select-option";
import styles from "./style.module.scss";

/** Выпадающий список с названиями выбранных вариантов и необязательными изображениями. */
export function Select(props: SelectProps) {
  const {
    options,
    placeholder = "Не выбрано",
    ariaLabel,
    variant = "input",
    className,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.filter((option) => (
    props.multiple
      ? props.value.includes(option.value)
      : option.value === props.value
  ));
  const current = selected[0];
  const summary = selected.map((option) => option.label).join(", ");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    /** Закрывает список при нажатии вне поля. */
    function closeOutside(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOutside);

    return () => {
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [isOpen]);

  /** Открывает или закрывает варианты выбора. */
  function togglePanel() {
    setIsOpen(!isOpen);
  }

  /** Обновляет одно значение или переключает отметку в списке значений. */
  function selectValue(value: string) {
    if (props.multiple) {
      const nextValues = props.value.includes(value)
        ? props.value.filter((item) => item !== value)
        : [...props.value, value];

      props.onChange(nextValues);
      return;
    }

    props.onChange(value);
    setIsOpen(false);
  }

  return (
    <div
      className={cn(styles.root, className)}
      ref={rootRef}
    >
      <button
        type="button"
        className={cn(styles.trigger, {
          [styles.triggerPill]: variant === "pill",
        })}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={togglePanel}
      >
        {variant === "pill" && current?.image && (
          <Image
            src={current.image}
            alt=""
            width={40}
            height={40}
            className={styles.triggerIcon}
          />
        )}
        {variant === "pill" && !props.multiple ? (
          <span className={styles.triggerLabel}>
            <span className={styles.optionTop}>
              {current ? current.label : placeholder}
            </span>
            {current?.hint && (
              <span className={styles.optionBottom}>{current.hint}</span>
            )}
          </span>
        ) : (
          <span className={selected.length ? styles.summary : styles.placeholder}>
            {selected.length ? summary : placeholder}
          </span>
        )}
        <ChevronIcon
          className={cn(styles.chevron, {
            [styles.chevronOpen]: isOpen,
          })}
          color="currentColor"
        />
      </button>

      {isOpen && (
        <ul
          className={styles.menu}
          role="listbox"
          aria-multiselectable={props.multiple}
          aria-label={ariaLabel}
        >
          {options.map((option) => (
            <SelectOptionButton
              key={option.value}
              option={option}
              isSelected={selected.includes(option)}
              multiple={props.multiple}
              onSelect={selectValue}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export type { SelectOption } from "./model/types";
