"use client";

import type { SyntheticEvent } from "react";
import { useRef, useState } from "react";
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
}

function parseValue(value: string): Date | null {
  if (!value) return null;
  if (value.includes("T")) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(`${value}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatIso(date: Date, withTime: boolean): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  if (!withTime) return `${y}-${m}-${d}`;
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

function formatDisplay(value: string, withTime: boolean): string {
  const date = parseValue(value);
  if (!date) return "";
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
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = parseValue(value);
  const [draftDate, setDraftDate] = useState<Date | null>(selected);
  const timeInteractionRef = useRef(false);

  const handleOpen = () => {
    setDraftDate(selected);
    setIsOpen(true);
  };

  const handleSelect = (date: Date | null) => {
    if (!withTime) return;
    setDraftDate(date);
  };

  const handleChange = (date: Date | null, event?: SyntheticEvent<HTMLElement>) => {
    if (!date) return;

    if (!withTime) {
      onChange(formatIso(date, false));
      setIsOpen(false);
      return;
    }

    setDraftDate(date);

    const target = event?.target;
    const isTimeClick = timeInteractionRef.current || (
      target instanceof HTMLElement
      && Boolean(target.closest(".react-datepicker__time-container"))
    );

    if (isTimeClick) {
      onChange(formatIso(date, true));
      setIsOpen(false);
    }

    timeInteractionRef.current = false;
  };

  const handleClear = () => {
    onChange("");
    setDraftDate(null);
    setIsOpen(false);
  };

  return (
    <div className={s.field}>
      <button
        type="button"
        className={`${s.trigger} ${isOpen ? s.triggerOpen : ""}`}
        onClick={handleOpen}
      >
        <span className={value ? s.value : s.placeholder}>
          {value ? formatDisplay(value, withTime) : placeholder}
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
            onMouseDownCapture={(event) => {
              const target = event.target;
              timeInteractionRef.current = target instanceof HTMLElement
                && Boolean(target.closest(".react-datepicker__time-container"));
            }}
          >
            <DatePicker
              selected={withTime ? draftDate : selected}
              onChange={handleChange}
              onSelect={handleSelect}
              inline
              locale="ru"
              showTimeSelect={withTime}
              shouldCloseOnSelect={!withTime}
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Время"
              calendarClassName={s.calendar}
            >
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
            </DatePicker>
          </div>
        </div>
      )}
    </div>
  );
}