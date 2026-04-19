import { ReviewCardSkeleton } from "@/source/entities/review";
import Skeleton from "@/source/shared/ui/Skeleton";
import carousel from "./ReviewsCarousel.module.scss";
import s from "./ExpertReviewsSkeleton.module.scss";

export function ExpertReviewsSkeleton() {
  return (
    <div className={carousel.cardsSection} aria-hidden="true">
      <div className={carousel.shadeLeft} />
      <div className={carousel.shadeRight} />

      <div className={s.track}>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={carousel.slide}>
            <div className={`${carousel.slideInner} ${index === 1 ? carousel.slideActive : ""}`}>
              <ReviewCardSkeleton />
            </div>
          </div>
        ))}
      </div>

      <div className={carousel.pagination}>
        <Skeleton className={s.navButton} rounded="md" />
        <div className={carousel.pages}>
          <Skeleton className={s.pageActive} rounded="md" />
          <Skeleton className={s.page} rounded="md" />
          <Skeleton className={s.page} rounded="md" />
        </div>
        <Skeleton className={s.navButton} rounded="md" />
      </div>
    </div>
  );
}