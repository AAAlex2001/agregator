import cn from "classnames";
import { ChevronIcon } from "@/shared/ui/icons";
import type { ServiceShowcaseItem } from "../../model/types";
import styles from "./style.module.scss";

/** Пункт каталога и выбор соответствующей иллюстрации. */
interface ServiceShowcaseOptionProps {
  item: ServiceShowcaseItem;
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
}

/** Показывает заголовок пункта и раскрывает пояснение выбранного пункта. */
export function ServiceShowcaseOption({
  item,
  index,
  isActive,
  onSelect,
}: ServiceShowcaseOptionProps) {
  /** Выбирает пункт, описание которого нужно показать рядом со списком. */
  function selectItem() {
    onSelect(index);
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

      {isActive && (
        <div className={styles.body}>
          <p className={styles.desc}>{item.text}</p>
        </div>
      )}
    </li>
  );
}
