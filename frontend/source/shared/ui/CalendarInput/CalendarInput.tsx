"use client";

import { useEffect, useState } from "react";
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
  active?: boolean;
  error?: string;
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
  active = false,
  error,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = parseValue(value);
  const [draftDate, setDraftDate] = useState<Date | null>(parseValue(value));

  useEffect(() => {
    if (!isOpen) {
      setDraftDate(parseValue(value));
    }
  }, [isOpen, value]);

  const handleOpen = () => {
    setDraftDate(parseValue(value));
    setIsOpen(true);
  };

  const handleClose = () => {
    setDraftDate(parseValue(value));
    setIsOpen(false);
  };

  const handleChange = (date: Date | null) => {
    setDraftDate(date);
  };

  const handleConfirm = () => {
    if (!draftDate) {
      return;
    }

    onChange(formatIso(draftDate, withTime));
    setIsOpen(false);
  };

  const handleClear = () => {
    setDraftDate(null);
    onChange("");
    setIsOpen(false);
  };

  return (
    <div className={`${s.field} ${className ?? ""}`.trim()}>
      <button
        type="button"
        className={`${s.trigger} ${active ? s.triggerActive : ""} ${isOpen ? s.triggerOpen : ""} ${error ? s.triggerError : ""}`.trim()}
        onClick={handleOpen}
      >
        <span className={selected ? s.value : s.placeholder}>
          {selected ? formatDisplay(selected, withTime) : placeholder}
        </span>
        <ChevronIcon
          className={`${s.chevron} ${isOpen ? s.chevronOpen : ""}`}
          color={active || isOpen ? "#FF8A00" : "#383F45"}
        />
      </button>

      {error ? <span className={s.errorMessage}>{error}</span> : null}

      {isOpen && (
        <div className={s.overlay} onClick={handleClose}>
          <div
            className={`${s.modal} ${withTime ? s.modalWithTime : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <DatePicker
              selected={draftDate}
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
              <Button
                type="button"
                variant="primary"
                size="md"
                fullWidth
                className={s.confirmButton}
                onClick={handleConfirm}
                disabled={!draftDate}
              >
                Подтвердить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}