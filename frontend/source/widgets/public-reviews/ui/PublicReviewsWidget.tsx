"use client";

import { useEffect, useState } from "react";
import { fetchPublicReviews, type LandingReview } from "@/source/entities/landing-review";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { PublicReviewCard } from "./PublicReviewCard";
import { PublicReviewsSkeleton } from "./PublicReviewsSkeleton";
import s from "./PublicReviewsWidget.module.scss";

interface Props {
  initial?: LandingReview[];
}

export function PublicReviewsWidget({ initial }: Props = {}) {
  const { showError } = useNotifications();
  const [items, setItems] = useState<LandingReview[]>(initial ?? []);
  const [isLoading, setIsLoading] = useState(!initial);

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    setIsLoading(true);
    fetchPublicReviews()
      .then((data) => {
        if (cancelled) return;
        setItems(data);
      })
      .catch((error) => {
        if (cancelled) return;
        showError(error instanceof Error ? error.message : "Не удалось загрузить отзывы");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
