import { ReviewStarIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

/** Один вариант оценки в форме отзыва. */
interface RatingStarProps {
  value: number;
  active: boolean;
  onChange: (rating: number) => void;
}

/** Позволяет выбрать оценку нажатием на соответствующую звезду. */
export function RatingStar({ value, active, onChange }: RatingStarProps) {
  /** Выбирает оценку, соответствующую этой звезде. */
  function chooseRating() {
    onChange(value);
  }

  return (
    <button
      type="button"
      className={styles.starButton}
      onClick={chooseRating}
      aria-label={`Оценка ${value}`}
    >
      <ReviewStarIcon active={active} />
    </button>
  );
}
