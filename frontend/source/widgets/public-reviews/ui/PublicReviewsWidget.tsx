"use client";

import { usePublicReviews, type LandingReview } from "@/source/entities/landing-review";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { PublicReviewCard } from "./PublicReviewCard";
import { PublicReviewsSkeleton } from "./PublicReviewsSkeleton";
import s from "./PublicReviewsWidget.module.scss";

interface Props {
  initial?: LandingReview[];
}

export function PublicReviewsWidget({ initial }: Props = {}) {
  const { items, isLoading } = usePublicReviews(initial);

  return (
    <section className={s.wrapper}>
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Отзывы" }]} />
      <div className={s.pageHead}>
        <Title text="Отзывы" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Что говорят о нас компании, которые уже работали на платформе"
          className={s.pageSubtitle}
        />
      </div>

      {isLoading ? (
        <PublicReviewsSkeleton />
      ) : items.length === 0 ? (
        <div className={s.emptyState}>
          <EmptyStateCard
            title="Отзывов пока нет"
            subtitle="Совсем скоро здесь появятся первые отзывы от наших клиентов"
          />
        </div>
      ) : (
        <ul className={s.list}>
          {items.map((review) => (
            <li key={review.id}>
              <PublicReviewCard
                text={review.text}
                reviewer={review.reviewer}
                position={review.position}
                createdAt={review.created_at}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
