"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronIcon } from "@/source/shared/ui/icons";
import s from "./select.module.scss";

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
  image?: string;
}

interface BaseProps {
  options: SelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  /** pill — крупная кнопка с картинкой, input — поле в стиле формы. */
  variant?: "pill" | "input";
  className?: string;
}

type SingleProps = BaseProps & {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
};

type MultipleProps = BaseProps & {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
};

export function Select(props: SingleProps | MultipleProps) {
  const {
    options,
    placeholder = "Не выбрано",
    ariaLabel,
    variant = "input",
    className,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [isOpen]);

  const selected = props.multiple
    ? options.filter((option) => props.value.includes(option.value))
    : options.filter((option) => option.value === props.value);

  const select = (option: SelectOption) => {
    if (props.multiple) {
      props.onChange(
        props.value.includes(option.value)
          ? props.value.filter((item) => item !== option.value)
          : [...props.value, option.value],
      );
      return;
    }
    props.onChange(option.value);
    setIsOpen(false);
  };

  const current = selected[0];
  const summary = selected.map((option) => option.label).join(", ");

  return (
    <div className={className ? `${s.root} ${className}` : s.root} ref={rootRef}>
      <button
        type="button"
        className={variant === "pill" ? `${s.trigger} ${s.triggerPill}` : s.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        onClick={() => setIsOpen((value) => !value)}
      >
        {variant === "pill" && current?.image && (
          <Image src={current.image} alt="" width={40} height={40} className={s.triggerIcon} />
        )}
        {variant === "pill" && !props.multiple ? (
          <span className={s.triggerLabel}>
            <span className={s.optionTop}>{current ? current.label : placeholder}</span>
            {current?.hint && <span className={s.optionBottom}>{current.hint}</span>}
          </span>
        ) : (
          <span className={selected.length ? s.summary : s.placeholder}>
            {selected.length ? summary : placeholder}
          </span>
        )}
        <ChevronIcon
          className={isOpen ? `${s.chevron} ${s.chevronOpen}` : s.chevron}
          color="currentColor"
        />
      </button>

      {isOpen && (
        <ul
          className={s.menu}
          role="listbox"
          aria-multiselectable={props.multiple}
          aria-label={ariaLabel}
        >
          {options.map((option) => {
            const isSelected = props.multiple
              ? props.value.includes(option.value)
              : props.value === option.value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={isSelected ? `${s.option} ${s.optionActive}` : s.option}
                  onClick={() => select(option)}
                >
                  {props.multiple && <span className={s.box} aria-hidden />}
                  {option.image && (
                    <Image
                      src={option.image}
                      alt=""
                      width={32}
                      height={32}
                      className={s.optionIcon}
                    />
                  )}
                  <span className={s.optionLabel}>
                    <span className={s.optionTop}>{option.label}</span>
                    {option.hint && <span className={s.optionBottom}>{option.hint}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
