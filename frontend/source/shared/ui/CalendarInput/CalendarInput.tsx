"use client";

import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import Button from "../Button";
import { ChevronIcon } from "@/source/shared/ui/icons";
import {
  formatManualDateValue,
  formatMoscowApiValue,
  maskManualDateValue,
  parseManualDateValue,
  parseMoscowWallClock,
} from "@/source/shared/lib/formatDate";
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
  const selected = parseMoscowWallClock(value);
  const [draftDate, setDraftDate] = useState<Date | null>(parseMoscowWallClock(value));
  const [manualValue, setManualValue] = useState(
    selected ? formatManualDateValue(selected, withTime) : "",
  );

  useEffect(() => {
    if (!isOpen) {
      const parsed = parseMoscowWallClock(value);
      setDraftDate(parsed);
      setManualValue(parsed ? formatManualDateValue(parsed, withTime) : "");
    }
  }, [isOpen, value]);

  const handleOpen = () => {
    const parsed = parseMoscowWallClock(value);
    setDraftDate(parsed);
    setManualValue(parsed ? formatManualDateValue(parsed, withTime) : "");
    setIsOpen(true);
  };

  const handleClose = () => {
    const parsed = parseMoscowWallClock(value);
    setDraftDate(parsed);
    setManualValue(parsed ? formatManualDateValue(parsed, withTime) : "");
    setIsOpen(false);
  };

  const handleChange = (date: Date | null) => {
    setDraftDate(date);
    setManualValue(date ? formatManualDateValue(date, withTime) : "");
  };

  const handleConfirm = () => {
    if (!draftDate) {
      return;
    }

    onChange(formatMoscowApiValue(draftDate, withTime));
    setIsOpen(false);
  };

  const handleClear = () => {
    setDraftDate(null);
    setManualValue("");
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
            <label className={s.manualField}>
              <span>{withTime ? "Дата и время (МСК)" : "Дата"}</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder={withTime ? "ДД.ММ.ГГГГ ЧЧ:ММ" : "ДД.ММ.ГГГГ"}
                value={manualValue}
                onChange={(event) => {
                  const next = maskManualDateValue(event.target.value, withTime);
                  setManualValue(next);
                  setDraftDate(parseManualDateValue(next, withTime));
                }}
              />
            </label>
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
