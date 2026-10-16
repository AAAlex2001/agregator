import styles from "./style.module.scss";

/** Выбранный код требований и действия изменения или сброса фильтра. */
interface ActiveFilterProps {
  code: string;
  onOpen: () => void;
  onClear: () => void;
}

/** Показывает выбранное направление под поиском и кнопку его сброса. */
export function ActiveFilter({ code, onOpen, onClear }: ActiveFilterProps) {
  return (
    <div className={styles.activeFilter}>
      <button
        type="button"
        className={styles.activeFilterValue}
        onClick={onOpen}
      >
        {code}
      </button>
      <button
        type="button"
        className={styles.clearFilter}
        aria-label="Сбросить выбранное направление"
        onClick={onClear}
      >
        ×
      </button>
    </div>
  );
}
