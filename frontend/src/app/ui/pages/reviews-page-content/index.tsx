"use client";

import { usePublicReviews } from "@/entities/landing-content";
import { EmptyState } from "@/shared/ui/empty-state";
import { PublicReviews } from "@/widgets/public-reviews";

/** Загружает отзывы в кабинете; ошибку загрузки показывает на месте списка. */
export function ReviewsPageContent() {
  const { items, isLoading, error } = usePublicReviews();

  if (error) {
    return (
      <EmptyState
        title="Не удалось загрузить отзывы"
        subtitle={error}
      />
    );
  }

  return (
    <PublicReviews
      items={items}
      isLoading={isLoading}
      homeHref="/landing"
    />
  );
}
