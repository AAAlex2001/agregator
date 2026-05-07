import { ReviewCardSkeleton } from "@/source/entities/review";
import s from "./ExpertReviewsWidget.module.scss";

export function ExpertReviewsSkeleton() {
  return (
    <div className={s.list} aria-hidden="true">
      {Array.from({ length: 3 }, (_, index) => (
        <ReviewCardSkeleton key={index} />
      ))}
    </div>
  );
}
