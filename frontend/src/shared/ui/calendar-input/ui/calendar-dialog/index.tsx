"use client";

import cn from "classnames";
import { useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ru } from "date-fns/locale/ru";
import { Button } from "@/shared/ui/button";
import {
  formatCalendarValue,
  formatManualDate,
  maskManualDate,
  parseCalendarValue,
  parseManualDate,
} from "../../model/date-value";
import styles from "./style.module.scss";

registerLocale("ru", ru);

/** Начальная дата и действия подтверждения, очистки и отмены черновика. */
interface CalendarDialogProps {
  value: string;
  withTime: boolean;
  onConfirm: (value: string) => void;
  onClear: () => void;
  onClose: () => void;
}

/** Редактирует черновик даты; применяет его только после подтверждения. */
export function CalendarDialog({
  value,
  withTime,
  onConfirm,
  onClear,
  onClose,
}: CalendarDialogProps) {
  const [selectedDate, setSelectedDate] = useState(() => parseCalendarValue(value));
  const [manualValue, setManualValue] = useState(() =>
    selectedDate ? formatManualDate(selectedDate, withTime) : "",
  );

  /** Переносит выбранный день из календаря в поле ручного ввода. */
  function selectDate(date: Date | null) {
    setSelectedDate(date);
    setManualValue(date ? formatManualDate(date, withTime) : "");
  }

  /** Расставляет разделители в ручном вводе и переносит полную дату в календарь. */
  function changeManualValue(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = maskManualDate(event.target.value, withTime);
    setManualValue(nextValue);
    setSelectedDate(parseManualDate(nextValue, withTime));
  }

  /** Не даёт нажатию внутри окна закрыть его как нажатию по фону. */
  function keepOpen(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  /** Передаёт выбранную дату в формате API. */
  function confirm() {
    if (selectedDate) {
      onConfirm(formatCalendarValue(selectedDate, withTime));
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={cn(styles.modal, {
          [styles.modalWithTime]: withTime,
        })}
        onClick={keepOpen}
      >
        <label className={styles.manualField}>
          <span>{withTime ? "Дата и время (МСК)" : "Дата"}</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder={withTime ? "ДД.ММ.ГГГГ ЧЧ:ММ" : "ДД.ММ.ГГГГ"}
            value={manualValue}
            onChange={changeManualValue}
          />
        </label>

        <DatePicker
          selected={selectedDate}
          onChange={selectDate}
          inline
          locale="ru"
          showTimeSelect={withTime}
          shouldCloseOnSelect={false}
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Время"
          calendarClassName={styles.calendar}
        />

        <div className={styles.actions}>
          <Button
            type="button"
            variant="transparent"
            size="md"
            fullWidth
            className={styles.clearButton}
            onClick={onClear}
          >
            Очистить
          </Button>

          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            className={styles.confirmButton}
            disabled={!selectedDate}
            onClick={confirm}
          >
            Подтвердить
          </Button>
        </div>
      </div>
    </div>
  );
}
