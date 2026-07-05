import s from "./style.module.scss";

const RADIUS = 31;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ratingColor(rating: number): string {
  if (rating >= 4.5) return "#FFB800";
  if (rating >= 3.5) return "#FFD23F";
  if (rating >= 2.5) return "#FF8A00";
  if (rating >= 1.5) return "#FF5A2D";
  return "#E33B2E";
}

export function RatingRing({ rating }: { rating: number }) {
  const fraction = Math.min(1, Math.max(0, rating / 5));
  const color = ratingColor(rating);

  return (
    <div className={s.ring}>
      <svg className={s.svg} viewBox="0 0 72 72">
        <circle className={s.track} cx="36" cy="36" r={RADIUS} />
        <circle
          className={s.arc}
          cx="36"
          cy="36"
          r={RADIUS}
          stroke={color}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
        />
      </svg>
      <span className={s.value} style={{ color }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
