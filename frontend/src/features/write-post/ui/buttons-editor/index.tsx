"use client";

import { useState } from "react";
import type { TelegramButton } from "@/entities/post";
import { addButtonRow, addButtonToRow, changeButton, removeButton } from "../../model/buttons";
import type { ButtonPlace } from "../../model/types";
import { ButtonFields } from "../button-fields";
import { ButtonKeyboard } from "../button-keyboard";
import styles from "./style.module.scss";

/** Ряды кнопок, блокировка и замена рядов. */
interface ButtonsEditorProps {
  rows: TelegramButton[][];
  disabled: boolean;
  onChange: (rows: TelegramButton[][]) => void;
}

/** Кнопки под постом: клавиатура как в Telegram и настройка выбранной кнопки под ней. */
export function ButtonsEditor({ rows, disabled, onChange }: ButtonsEditorProps) {
  const [selected, setSelected] = useState<ButtonPlace | null>(null);
  const button = selected ? rows[selected.row]?.[selected.column] : undefined;

  /** Новый ряд с одной кнопкой; она сразу открывается для настройки. */
  function addRow() {
    onChange(addButtonRow(rows));
    setSelected({ row: rows.length, column: 0 });
  }

  /** Новая кнопка в конце ряда; она сразу открывается для настройки. */
  function addToRow(row: number) {
    onChange(addButtonToRow(rows, row));
    setSelected({ row, column: rows[row].length });
  }

  /** Заменяет выбранную кнопку изменённой. */
  function change(place: ButtonPlace, changed: TelegramButton) {
    onChange(changeButton(rows, place.row, place.column, changed));
  }

  /** Убирает выбранную кнопку и закрывает её настройку. */
  function remove(place: ButtonPlace) {
    onChange(removeButton(rows, place.row, place.column));
    setSelected(null);
  }

  return (
    <div className={styles.editor}>
      {rows.length > 0 && (
        <p className={styles.hint}>
          Так кнопки будут выглядеть под постом. Нажмите на кнопку, чтобы её настроить,
          или на «+», чтобы добавить ещё одну в тот же ряд.
        </p>
      )}
      <ButtonKeyboard
        rows={rows}
        selected={selected}
        disabled={disabled}
        onSelect={setSelected}
        onAddToRow={addToRow}
        onAddRow={addRow}
      />
      {selected && button && (
        <ButtonFields
          button={button}
          onChange={(changed) => change(selected, changed)}
          onRemove={() => remove(selected)}
        />
      )}
    </div>
  );
}
