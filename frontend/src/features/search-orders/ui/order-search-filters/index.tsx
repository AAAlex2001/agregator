import { ExpertiseCodeSelector } from "@/entities/expertise";
import { useTouchScrollGuard } from "@/shared/lib/use-touch-scroll-guard";
import styles from "./style.module.scss";

/** Закрытие панели и применение выбранного кода экспертных требований. */
interface OrderSearchFiltersProps {
  onClose: () => void;
  onSelect: (code: string) => void;
}

/** Показывает выбор направления под поиском или в мобильной нижней панели. */
export function OrderSearchFilters({
  onClose,
  onSelect,
}: OrderSearchFiltersProps) {
  const touchScrollGuard = useTouchScrollGuard();

  return (
    <>
      <button
        type="button"
        className={styles.mobileBackdrop}
        aria-label="Закрыть фильтры"
        onClick={onClose}
      />
      <div
        className={styles.panel}
        {...touchScrollGuard}
      >
        <div className={styles.mobileHead}>
          <strong>Направление работ</strong>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>
        <ExpertiseCodeSelector onSelect={onSelect} />
      </div>
    </>
  );
}
