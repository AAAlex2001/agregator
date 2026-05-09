import { ListCard } from "@/source/shared/ui/ListCard";
import { StarIcon } from "@/source/shared/ui/icons";
import s from "./PublicReviewCard.module.scss";

interface Props {
  text: string;
  reviewer: string;
  position: string;
  createdAt: string;
}

const RATING = 5;

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function PublicReviewCard({ text, reviewer, position, createdAt }: Props) {
  return (
    <ListCard
      meta={`Отзыв от ${formatDate(createdAt)}`}
      titleLabel="Кто оставил:"
      title={reviewer || "—"}
      bottomLeftLabel="Должность:"
      bottomLeftValue={position || "—"}
      leftExtra={
        <>
          <div className={s.ratingBlock}>
            <span className={s.label}>Оценка:</span>
            <div className={s.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= RATING} width={20} height={20} />
              ))}
            </div>
          </div>
          {text && (
            <div className={s.commentBlock}>
              <span className={s.label}>Отзыв:</span>
              <p className={s.quote}>
                <span className={s.quoteMark}>&ldquo;</span>
                {text}
                <span className={s.quoteMark}>&rdquo;</span>
              </p>
            </div>
          )}
        </>
      }
    />
  );
}
