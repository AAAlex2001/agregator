import styles from "./style.module.scss";

/** Предыдущее и текущее значения с настройкой подписи изменения. */
interface DiffValueProps {
  previous: string | null | undefined;
  current: string;
  fallback?: string;
  hideLabel?: boolean;
}

/** Зачёркивает изменившееся значение и выделяет новое; пустое заменяет прочерком. */
export function DiffValue({
  previous,
  current,
  fallback = "—",
  hideLabel = false,
}: DiffValueProps) {
  const value = current || fallback;

  if (!previous || previous === current) {
    return <>{value}</>;
  }

  return (
    <span className={styles.diff}>
      <span className={styles.previous}>{previous}</span>
      {!hideLabel && <span className={styles.label}>Изменено:</span>}
      <span className={styles.current}>{value}</span>
    </span>
  );
}
