"use client";

import type { SyntheticEvent } from "react";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import Button from "../Button";
import { ChevronIcon } from "@/source/shared/ui/icons";
import s from "./CalendarInput.module.scss";

registerLocale("ru", ru);

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  withTime?: boolean;
  className?: string;
}

function parseValue(value: string): Date | null {
  if (!value) return null;
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatIso(date: Date, withTime: boolean): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  if (!withTime) return day;
  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDisplay(date: Date, withTime: boolean): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  if (withTime) {
    opts.hour = "2-digit";
    opts.minute = "2-digit";
  }
  return date.toLocaleString("ru-RU", opts);
}

export function CalendarInput({
  value,
  onChange,
  placeholder = "Выберите дату",
  withTime = false,
  className,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = parseValue(value);

  const handleChange = (date: Date | null, event?: SyntheticEvent<HTMLElement>) => {
    if (!date) return;
    onChange(formatIso(date, withTime));

    if (!withTime) {
      setIsOpen(false);
      return;
    }

    const target = event?.target;
    const clickedTime =
      target instanceof HTMLElement &&
      target.closest(".react-datepicker__time-list-item");
    if (clickedTime) setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className={`${s.field} ${className ?? ""}`.trim()}>
      <button
        type="button"
        className={`${s.trigger} ${isOpen ? s.triggerOpen : ""}`}
        onClick={() => setIsOpen(true)}
      >
        <span className={selected ? s.value : s.placeholder}>
          {selected ? formatDisplay(selected, withTime) : placeholder}
        </span>
        <ChevronIcon
          className={`${s.chevron} ${isOpen ? s.chevronOpen : ""}`}
          color="#383F45"
        />
      </button>

      {isOpen && (
        <div className={s.overlay} onClick={() => setIsOpen(false)}>
          <div
            className={`${s.modal} ${withTime ? s.modalWithTime : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <DatePicker
              selected={selected}
              onChange={handleChange}
              inline
              locale="ru"
              showTimeSelect={withTime}
              shouldCloseOnSelect={false}
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Время"
              calendarClassName={s.calendar}
            />
            <div className={s.actions}>
              <Button
                type="button"
                variant="transparent"
                size="md"
                fullWidth
                className={s.clearButton}
                onClick={handleClear}
              >
                Очистить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}