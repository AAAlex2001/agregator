"use client";

import cn from "classnames";
import { useState } from "react";
import { ChevronIcon } from "@/shared/ui/icons";
import { formatCalendarLabel, parseCalendarValue } from "./model/date-value";
import { CalendarDialog } from "./ui/calendar-dialog";
import styles from "./style.module.scss";

/** Дата в формате API; withTime включает время и московское смещение. */
interface CalendarInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  withTime?: boolean;
  className?: string;
  active?: boolean;
  error?: string;
}

/** Поле даты с календарём, ручным вводом и необязательным московским временем. */
export function CalendarInput({
  value,
  onChange,
  placeholder = "Выберите дату",
  withTime = false,
  className,
  active = false,
  error,
}: CalendarInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedDate = parseCalendarValue(value);

  /** Открывает календарь с текущей датой. */
  function open() {
    setIsOpen(true);
  }

  /** Закрывает календарь без изменения даты. */
  function close() {
    setIsOpen(false);
  }

  /** Сохраняет подтверждённую дату и закрывает календарь. */
  function confirm(selectedValue: string) {
    onChange(selectedValue);
    setIsOpen(false);
  }

  /** Очищает дату и закрывает календарь. */
  function clear() {
    onChange("");
    setIsOpen(false);
  }

  return (
    <div className={cn(styles.field, className)}>
      <button
        type="button"
        className={cn(styles.trigger, {
          [styles.triggerActive]: active,
          [styles.triggerOpen]: isOpen,
          [styles.triggerError]: error,
        })}
        onClick={open}
      >
        <span className={selectedDate ? styles.value : styles.placeholder}>
          {selectedDate ? formatCalendarLabel(selectedDate, withTime) : placeholder}
        </span>

        <ChevronIcon
          className={cn(styles.chevron, {
            [styles.chevronOpen]: isOpen,
          })}
          color={
            active || isOpen
              ? "var(--color-orange-primary)"
              : "var(--color-calendar-text)"
          }
        />
      </button>

      {error && <span className={styles.errorMessage}>{error}</span>}

      {isOpen && (
        <CalendarDialog
          value={value}
          withTime={withTime}
          onConfirm={confirm}
          onClear={clear}
          onClose={close}
        />
      )}
    </div>
  );
}
