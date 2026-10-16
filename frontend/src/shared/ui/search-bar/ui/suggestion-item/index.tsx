import cn from "classnames";
import type { MouseEvent } from "react";
import type { SearchBarSuggestion } from "../../model/types";
import styles from "./style.module.scss";

/** Одна подсказка и действия выбора или выделения указателем. */
interface SuggestionItemProps {
  suggestion: SearchBarSuggestion;
  index: number;
  isActive: boolean;
  onHover?: (index: number) => void;
  onPick?: (suggestion: SearchBarSuggestion) => void;
}

/** Показывает подсказку и сохраняет фокус поля при её выборе. */
export function SuggestionItem({
  suggestion,
  index,
  isActive,
  onHover,
  onPick,
}: SuggestionItemProps) {
  /** Подтверждает подсказку до того, как поле поиска потеряет фокус. */
  function pickSuggestion(event: MouseEvent<HTMLLIElement>) {
    event.preventDefault();
    onPick?.(suggestion);
  }

  /** Передаёт положение подсказки для выделения в списке. */
  function highlightSuggestion() {
    onHover?.(index);
  }

  return (
    <li
      role="option"
      aria-selected={isActive}
      className={cn(styles.item, {
        [styles.itemActive]: isActive,
      })}
      onMouseDown={pickSuggestion}
      onMouseEnter={highlightSuggestion}
    >
      <span className={styles.itemTitle}>{suggestion.title}</span>
      {suggestion.subtitle && (
        <span className={styles.itemSubtitle}>{suggestion.subtitle}</span>
      )}
    </li>
  );
}
