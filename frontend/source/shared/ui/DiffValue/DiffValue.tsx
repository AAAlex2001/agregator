import s from "./DiffValue.module.scss";

interface Props {
  previous: string | null | undefined;
  current: string;
  fallback?: string;
  /** Скрыть подпись «Изменено». По умолчанию подпись показывается. */
  hideLabel?: boolean;
}

/**
 * Если previous непустой и отличается от current — рендерит зачёркнутое предыдущее значение
 * сверху, подпись «Изменено» и зелёное новое значение. Иначе — просто текущее значение.
 */
export function DiffValue({ previous, current, fallback = "—", hideLabel = false }: Props) {
  const value = current || fallback;
  if (!previous || previous === current) {
    return <>{value}</>;
  }
  return (
    <span className={s.diff}>
      <span className={s.previous}>{previous}</span>
      {!hideLabel && <span className={s.label}>Изменено:</span>}
      <span className={s.current}>{value}</span>
    </span>
  );
}
