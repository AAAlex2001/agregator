import cn from "classnames";
import type { ReactNode } from "react";
import { ChevronIcon } from "@/shared/ui/icons";
import type { LandingNavigationItem } from "../../model/types";
import styles from "./style.module.scss";

/** Пункт навигации и карта, раскрываемая внутри него на узком экране. */
interface NavigationOptionProps {
  item: LandingNavigationItem;
  index: number;
  isActive: boolean;
  onSelect: (item: LandingNavigationItem) => void;
  children: ReactNode;
}

/** Показывает название направления и передаёт выбор родительской панели. */
export function NavigationOption({
  item,
  index,
  isActive,
  onSelect,
  children,
}: NavigationOptionProps) {
  /** Выбирает направление, указанное в этом пункте. */
  function selectItem() {
    onSelect(item);
  }

  return (
    <li
      className={cn(styles.item, {
        [styles.itemActive]: isActive,
      })}
    >
      <button
        type="button"
        className={styles.head}
        onClick={selectItem}
        aria-expanded={isActive}
      >
        <span className={styles.num}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className={styles.itemTitle}>{item.title}</span>
        <ChevronIcon
          className={styles.chevron}
          color="currentColor"
        />
      </button>
      {isActive && children && (
        <div className={styles.body}>
          <div className={styles.inlineVisual}>{children}</div>
        </div>
      )}
    </li>
  );
}
