"use client";

import type { TelegramButton } from "@/entities/post";
import { Button } from "@/shared/ui/button";
import { PlusIcon } from "@/shared/ui/icons";
import { MAX_BUTTON_ROWS, MAX_BUTTONS_IN_ROW } from "../../config/telegram-options";
import { addButtonRow, addButtonToRow, changeButton, removeButton } from "../../model/buttons";
import { ButtonFields } from "../button-fields";
import styles from "./style.module.scss";

/** Ряды кнопок, блокировка и замена рядов. */
interface ButtonsEditorProps {
  rows: TelegramButton[][];
  disabled: boolean;
  onChange: (rows: TelegramButton[][]) => void;
}

/** Ряды кнопок под постом: до 8 рядов, в ряду до 3 кнопок. */
export function ButtonsEditor({ rows, disabled, onChange }: ButtonsEditorProps) {
  return (
    <div className={styles.editor}>
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={styles.row}
        >
          <span className={styles.rowTitle}>Ряд {rowIndex + 1}</span>
          {row.map((button, columnIndex) => (
            <ButtonFields
              key={columnIndex}
              button={button}
              number={`${rowIndex + 1}.${columnIndex + 1}`}
              onChange={(changed) => onChange(changeButton(rows, rowIndex, columnIndex, changed))}
              onRemove={() => onChange(removeButton(rows, rowIndex, columnIndex))}
            />
          ))}
          {row.length < MAX_BUTTONS_IN_ROW && (
            <Button
              variant="transparent"
              size="sm"
              disabled={disabled}
              onClick={() => onChange(addButtonToRow(rows, rowIndex))}
            >
              <PlusIcon />
              Кнопка в этот ряд
            </Button>
          )}
        </div>
      ))}
      {rows.length < MAX_BUTTON_ROWS && (
        <Button
          variant="outline"
          size="sm"
          className={styles.addRow}
          disabled={disabled}
          onClick={() => onChange(addButtonRow(rows))}
        >
          <PlusIcon />
          Добавить ряд кнопок
        </Button>
      )}
    </div>
  );
}
