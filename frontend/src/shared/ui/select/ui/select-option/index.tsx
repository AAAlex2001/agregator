import cn from "classnames";
import Image from "next/image";
import type { SelectOption } from "../../model/types";
import styles from "./style.module.scss";

/** Вариант списка, его выделение и обработчик выбора. */
interface SelectOptionButtonProps {
  option: SelectOption;
  isSelected: boolean;
  multiple?: boolean;
  onSelect: (value: string) => void;
}

/** Показывает вариант с изображением, пояснением и отметкой выбора. */
export function SelectOptionButton({
  option,
  isSelected,
  multiple,
  onSelect,
}: SelectOptionButtonProps) {
  /** Передаёт значение выбранного варианта полю. */
  function selectOption() {
    onSelect(option.value);
  }

  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={isSelected}
        className={cn(styles.option, {
          [styles.optionActive]: isSelected,
        })}
        onClick={selectOption}
      >
        {multiple && (
          <span
            className={styles.box}
            aria-hidden
          />
        )}
        {option.image && (
          <Image
            src={option.image}
            alt=""
            width={32}
            height={32}
            className={styles.optionIcon}
          />
        )}
        <span className={styles.optionLabel}>
          <span className={styles.optionTop}>{option.label}</span>
          {option.hint && (
            <span className={styles.optionBottom}>{option.hint}</span>
          )}
        </span>
      </button>
    </li>
  );
}
