import styles from "./style.module.scss";

/** Общий показатель риска в процентах. */
interface RiskRingProps {
  percent: number;
}

/** Радиус кольца в координатах SVG 64×64. */
const RADIUS = 26;

/** Длина окружности кольца для заполнения штрихом. */
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** Показывает процент риска заполненным кольцом с числом в центре. */
export function RiskRing({ percent }: RiskRingProps) {
  const offset = CIRCUMFERENCE * (1 - percent / 100);

  return (
    <div className={styles.ring}>
      <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
      >
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke="var(--color-tool-ring-track)"
          strokeWidth="6"
        />
        <circle
          cx="32"
          cy="32"
          r={RADIUS}
          fill="none"
          stroke="var(--color-orange-primary)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <span className={styles.value}>{percent.toFixed(1)}%</span>
    </div>
  );
}
