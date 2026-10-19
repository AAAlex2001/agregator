import type { TelegramButton } from "@/entities/post";
import { EMPTY_BUTTON } from "../config/telegram-options";

/** Ряды кнопок под постом. */
type ButtonRows = TelegramButton[][];

/** Добавляет ряд с одной пустой кнопкой. */
export function addButtonRow(rows: ButtonRows): ButtonRows {
  return [...rows, [EMPTY_BUTTON]];
}

/** Добавляет пустую кнопку в конец ряда. */
export function addButtonToRow(rows: ButtonRows, rowIndex: number): ButtonRows {
  return rows.map((row, index) => (index === rowIndex ? [...row, EMPTY_BUTTON] : row));
}

/** Заменяет одну кнопку. */
export function changeButton(
  rows: ButtonRows,
  rowIndex: number,
  columnIndex: number,
  button: TelegramButton,
): ButtonRows {
  return rows.map((row, index) => {
    if (index !== rowIndex) {
      return row;
    }

    return row.map((item, column) => (column === columnIndex ? button : item));
  });
}

/** Убирает кнопку; опустевший ряд убирается вместе с ней. */
export function removeButton(rows: ButtonRows, rowIndex: number, columnIndex: number): ButtonRows {
  const changed = rows.map((row, index) => {
    if (index !== rowIndex) {
      return row;
    }

    return row.filter((item, column) => column !== columnIndex);
  });

  return changed.filter((row) => row.length > 0);
}
