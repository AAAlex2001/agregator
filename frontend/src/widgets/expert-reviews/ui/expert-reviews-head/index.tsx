import type { ReviewPage } from "@/entities/review";
import { StarIcon } from "@/shared/ui/icons";
import { Skeleton } from "@/shared/ui/skeleton";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Вид страницы и загруженная первая страница отзывов со сводкой оценок. */
interface ExpertReviewsHeadProps {
  isExpertPage: boolean;
  page: ReviewPage | null;
  hasError: boolean;
}

/** Показывает заголовок страницы отзывов и средний рейтинг исполнителя. */
export function ExpertReviewsHead({
  isExpertPage,
  page,
  hasError,
}: ExpertReviewsHeadProps) {
  const isLoading = !page && !hasError;
  const title = isExpertPage ? "Отзывы об исполнителе" : "Отзывы наших клиентов";
  const subtitle = isExpertPage
    ? "Оценки и комментарии заказчиков по завершённым заказам"
    : "Смотрите оценки и комментарии по завершённым заказам";

  return (
    <div className={styles.head}>
      <div className={styles.titleGroup}>
        <Title
          text={title}
          as="h1"
          className={styles.title}
        />
        {isExpertPage && isLoading && (
          <Skeleton
            className={styles.expertNameSkeleton}
            rounded="pill"
          />
        )}
        {isExpertPage && page?.expert_name && (
          <span className={styles.expertName}>{page.expert_name}</span>
        )}
      </div>
      <Subtitle
        text={subtitle}
        className={styles.subtitle}
      />

      {isLoading && (
        <div className={styles.ratingInfo}>
          <Skeleton
            className={styles.ratingIconSkeleton}
            rounded="md"
          />
          <div className={styles.ratingDetails}>
            <Skeleton
              className={styles.ratingValueSkeleton}
              rounded="pill"
            />
            <span className={styles.dot}>&middot;</span>
            <Skeleton
              className={styles.reviewCountSkeleton}
              rounded="pill"
            />
            <Skeleton
              className={styles.reviewLabelSkeleton}
              rounded="pill"
            />
          </div>
        </div>
      )}

      {!hasError && page && page.total_reviews > 0 && (
        <div className={styles.ratingInfo}>
          <StarIcon filled />
          <div className={styles.ratingDetails}>
            <span className={styles.ratingText}>
              {page.avg_rating.toLocaleString("ru-RU", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}
            </span>
            <span className={styles.dot}>&middot;</span>
            <span className={styles.ratingText}>{page.total_reviews}</span>
            <span className={styles.ratingText}>отзывов</span>
          </div>
        </div>
      )}
    </div>
  );
}
