import cn from "classnames";
import type { TelegramButton } from "@/entities/post";
import styles from "./style.module.scss";

/** Ряды кнопок под постом. */
interface PreviewKeyboardProps {
  rows: TelegramButton[][];
}

/** Кнопки под сообщением, как их рисует Telegram. */
export function PreviewKeyboard({ rows }: PreviewKeyboardProps) {
  return (
    <div className={styles.keyboard}>
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={styles.row}
        >
          {row.map((button, columnIndex) => (
            <span
              key={columnIndex}
              className={cn(styles.key, button.style && styles[button.style])}
            >
              {button.text || "Кнопка"}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
