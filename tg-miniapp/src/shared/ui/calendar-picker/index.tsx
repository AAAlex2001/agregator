import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { BottomSheet } from "../bottom-sheet";
import { Button } from "../button";
import "react-calendar/dist/Calendar.css";
import "./calendar.scss";

interface Props {
  open: boolean;
  value: string;
  withTime?: boolean;
  onClose: () => void;
  onApply: (date: string) => void;
}

function toISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseValue(value: string): Date | null {
  if (!value) return null;
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
  if (value.includes("T") && hasTimezone) {
    const instant = new Date(value);
    if (Number.isNaN(instant.getTime())) return null;
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Moscow",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(instant);
    const part = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((item) => item.type === type)?.value);
    return new Date(part("year"), part("month") - 1, part("day"), part("hour"), part("minute"));
  }
  const date = new Date(value.includes("T") ? value : `${value}T12:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toMoscowDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${toISODate(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}:00+03:00`;
}

export function CalendarPicker({ open, value, withTime = false, onClose, onApply }: Props) {
  const [date, setDate] = useState<Date | null>(parseValue(value));

  useEffect(() => {
    if (open) setDate(parseValue(value));
  }, [open, value]);

  const apply = () => {
    if (!date) return;
    onApply(withTime ? toMoscowDateTime(date) : toISODate(date));
    onClose();
  };

  return (
    <BottomSheet open={open} title={withTime ? "Выберите дату и время" : "Выберите дату"} onClose={onClose}>
      <label className="calendar-manual">
        <span>{withTime ? "Дата и время (МСК)" : "Дата"}</span>
        <input
          type={withTime ? "datetime-local" : "date"}
          value={date ? (withTime ? toMoscowDateTime(date).slice(0, 16) : toISODate(date)) : ""}
          onChange={(event) => setDate(parseValue(event.target.value))}
        />
      </label>
      <Calendar
        value={date}
        onChange={(next) => {
          if (next instanceof Date) {
            next.setHours(date?.getHours() ?? (withTime ? 23 : 12), date?.getMinutes() ?? (withTime ? 59 : 0));
            setDate(next);
          }
        }}
        locale="ru-RU"
        minDate={new Date()}
        prev2Label={null}
        next2Label={null}
      />
      <div className="calendar-actions">
        <Button variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={apply} disabled={!date}>
          Готово
        </Button>
      </div>
    </BottomSheet>
  );
}
