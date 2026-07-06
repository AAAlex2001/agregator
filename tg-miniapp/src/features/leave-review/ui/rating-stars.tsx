import { ReviewStarIcon } from "@/shared/ui/icons/interface";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./rating-stars.module.scss";

const STARS = [1, 2, 3, 4, 5];

export function RatingStars({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className={s.stars}>
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          className={s.star}
          aria-label={`Оценка ${star}`}
          onClick={() => {
            tapHaptic();
            onChange(star);
          }}
        >
          <ReviewStarIcon active={star <= value} width={32} height={32} />
        </button>
      ))}
    </div>
  );
}
