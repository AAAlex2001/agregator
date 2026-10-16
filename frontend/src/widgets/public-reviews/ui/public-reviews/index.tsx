import { PublicReviewCard } from "@/entities/landing-content";
import type { LandingReview } from "@/entities/landing-content";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { EmptyState } from "@/shared/ui/empty-state";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { PublicReviewsSkeleton } from "../public-reviews-skeleton";
import styles from "./style.module.scss";

/** Опубликованные отзывы и состояние загрузки клиентского списка. */
interface PublicReviewsProps {
  items: LandingReview[];
  isLoading?: boolean;
  homeHref: string;
}

/** Собирает страницу отзывов с прежними заголовком, карточками и пустым состоянием. */
export function PublicReviews({
  items,
  isLoading = false,
  homeHref,
}: PublicReviewsProps) {
  return (
    <section className={styles.wrapper}>
      <Breadcrumbs
        items={[
          {
            label: "Главная",
            href: homeHref,
          },
          {
            label: "Отзывы",
          },
        ]}
      />
      <div className={styles.pageHead}>
        <Title
          text="Отзывы"
          as="h1"
          className={styles.pageTitle}
        />
        <Subtitle
          text="Что говорят о нас компании, которые уже работали на платформе"
          className={styles.pageSubtitle}
        />
      </div>

      {isLoading ? (
        <PublicReviewsSkeleton />
      ) : items.length === 0 ? (
        <div className={styles.emptyState}>
          <EmptyState
            title="Отзывов пока нет"
            subtitle="Совсем скоро здесь появятся первые отзывы от наших клиентов"
          />
        </div>
      ) : (
        <ul className={styles.list}>
          {items.map((review) => (
            <li key={review.id}>
              <PublicReviewCard review={review} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
