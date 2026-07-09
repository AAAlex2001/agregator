import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { BottomSheet } from "../bottom-sheet";
import { Button } from "../button";
import { TextField } from "../text-field";
import {
  formatManualDateValue,
  formatMoscowApiValue,
  maskManualDateValue,
  parseManualDateValue,
  parseMoscowWallClock,
} from "@/shared/lib/format";
import "react-calendar/dist/Calendar.css";
import "./calendar.scss";

interface Props {
  open: boolean;
  value: string;
  withTime?: boolean;
  onClose: () => void;
  onApply: (date: string) => void;
}

export function CalendarPicker({ open, value, withTime = false, onClose, onApply }: Props) {
  const [date, setDate] = useState<Date | null>(parseMoscowWallClock(value));
  const [manualValue, setManualValue] = useState(
    date ? formatManualDateValue(date, withTime) : "",
  );

  useEffect(() => {
    if (open) {
      const parsed = parseMoscowWallClock(value);
      setDate(parsed);
      setManualValue(parsed ? formatManualDateValue(parsed, withTime) : "");
    }
  }, [open, value, withTime]);

  const apply = () => {
    if (!date) return;
    onApply(formatMoscowApiValue(date, withTime));
    onClose();
  };

  return (
    <BottomSheet open={open} title={withTime ? "Выберите дату и время" : "Выберите дату"} onClose={onClose}>
      <div className="calendar-manual">
        <TextField
          label={withTime ? "Дата и время (МСК)" : "Дата"}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder={withTime ? "ДД.ММ.ГГГГ ЧЧ:ММ" : "ДД.ММ.ГГГГ"}
          value={manualValue}
          onChange={(event) => {
            const next = maskManualDateValue(event.target.value, withTime);
            setManualValue(next);
            setDate(parseManualDateValue(next, withTime));
          }}
        />
      </div>
      <Calendar
        value={date}
        onChange={(next) => {
          if (next instanceof Date) {
            next.setHours(date?.getHours() ?? (withTime ? 23 : 12), date?.getMinutes() ?? (withTime ? 59 : 0));
            setDate(next);
            setManualValue(formatManualDateValue(next, withTime));
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
