import styles from "./style.module.scss";

/** Значение показателя, его единица, подпись и заполнение кольца. */
interface ReportGaugeProps {
  value: number;
  unit: string;
  label: string;
  fraction: number;
  color: string;
}

/** Радиус кольца в координатах SVG 78×78. */
const RADIUS = 30;

/** Длина окружности кольца для заполнения штрихом. */
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Показывает показатель отчёта кольцом с числом и подписью под ним. */
export function ReportGauge({
  value,
  unit,
  label,
  fraction,
  color,
}: ReportGaugeProps) {
  const offset = CIRCUMFERENCE * (1 - fraction);

  return (
    <div className={styles.gauge}>
      <div className={styles.ring}>
        <svg
          width="78"
          height="78"
          viewBox="0 0 78 78"
        >
          <circle
            cx="39"
            cy="39"
            r={RADIUS}
            fill="none"
            stroke="var(--color-border-sidebar)"
            strokeWidth="6"
          />
          <circle
            cx="39"
            cy="39"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform="rotate(-90 39 39)"
          />
        </svg>
        <span className={styles.value}>
          {value.toFixed(1)}
          <span className={styles.unit}>{unit}</span>
        </span>
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
