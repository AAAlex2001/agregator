import { useState } from "react";
import Calendar from "react-calendar";
import { BottomSheet } from "../bottom-sheet";
import { Button } from "../button";
import "react-calendar/dist/Calendar.css";
import "./calendar.scss";

interface Props {
  open: boolean;
  value: string;
  onClose: () => void;
  onApply: (date: string) => void;
}

function toISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function CalendarPicker({ open, value, onClose, onApply }: Props) {
  const [date, setDate] = useState<Date | null>(value ? new Date(value) : null);

  const apply = () => {
    if (!date) return;
    onApply(toISODate(date));
    onClose();
  };

  return (
    <BottomSheet open={open} title="Выберите дату" onClose={onClose}>
      <Calendar
        value={date}
        onChange={(next) => {
          if (next instanceof Date) setDate(next);
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
