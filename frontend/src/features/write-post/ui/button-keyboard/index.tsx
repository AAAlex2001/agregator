import cn from "classnames";
import type { ReactNode } from "react";
import type { TelegramButton, TelegramButtonKind } from "@/entities/post";
import { HoverHint } from "@/shared/ui/hover-hint";
import { ArrowUpRightIcon, LockIcon, PlusIcon } from "@/shared/ui/icons";
import { MAX_BUTTON_ROWS, MAX_BUTTONS_IN_ROW } from "../../config/telegram-options";
import type { ButtonPlace } from "../../model/types";
import styles from "./style.module.scss";

/** Ряды кнопок, выбранная кнопка и действия с клавиатурой. */
interface ButtonKeyboardProps {
  rows: TelegramButton[][];
  selected: ButtonPlace | null;
  disabled: boolean;
  onSelect: (place: ButtonPlace) => void;
  onAddToRow: (row: number) => void;
  onAddRow: () => void;
}

/** Значок вида кнопки, как в Telegram: стрелка у ссылки, замок у скрытого текста. */
function kindIcon(kind: TelegramButtonKind): ReactNode {
  if (kind === "url") {
    return <ArrowUpRightIcon className={styles.kind} />;
  }

  return kind === "hidden" ? <LockIcon className={styles.kind} /> : null;
}

/** Кнопки под постом так, как их увидят подписчики: по рядам, с плюсом для новой кнопки. */
export function ButtonKeyboard({
  rows,
  selected,
  disabled,
  onSelect,
  onAddToRow,
  onAddRow,
}: ButtonKeyboardProps) {
  return (
    <div className={styles.keyboard}>
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={styles.row}
        >
          {row.map((button, columnIndex) => {
            const isSelected = selected?.row === rowIndex && selected.column === columnIndex;

            return (
              <button
                key={columnIndex}
                type="button"
                className={cn(styles.key, button.style && styles[button.style], {
                  [styles.selected]: isSelected,
                })}
                aria-pressed={isSelected}
                disabled={disabled}
                onClick={() => onSelect({ row: rowIndex, column: columnIndex })}
              >
                <span className={cn(styles.text, { [styles.empty]: !button.text })}>
                  {button.text || "Без надписи"}
                </span>
                {kindIcon(button.kind)}
              </button>
            );
          })}
          {row.length < MAX_BUTTONS_IN_ROW && (
            <HoverHint label="Ещё кнопка в этот ряд">
              <button
                type="button"
                className={styles.addKey}
                aria-label={`Добавить кнопку в ряд ${rowIndex + 1}`}
                disabled={disabled}
                onClick={() => onAddToRow(rowIndex)}
              >
                <PlusIcon />
              </button>
            </HoverHint>
          )}
        </div>
      ))}
      {rows.length < MAX_BUTTON_ROWS && (
        <button
          type="button"
          className={styles.addRow}
          disabled={disabled}
          onClick={onAddRow}
        >
          <PlusIcon />
          {rows.length > 0 ? "Новый ряд" : "Добавить кнопку"}
        </button>
      )}
    </div>
  );
}
