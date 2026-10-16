"use client";

import cn from "classnames";
import { useEffect } from "react";
import { ExpertCard, ExpertCardSkeleton } from "@/entities/expert";
import { useExpertContacts } from "@/entities/expert-contact";
import type { ExpertContact } from "@/entities/expert-contact";
import { ContactAccess } from "@/features/open-contact-deal";
import { EmptyState } from "@/shared/ui/empty-state";
import { ExpertContactDetails } from "../expert-contact-details";
import styles from "./style.module.scss";

/** Отобранные исполнители, карточка из ссылки и вход для гостя. */
interface ExpertContactsListProps {
  experts: ExpertContact[];
  targetExpertId?: string;
  onOpenLogin: () => void;
}

/** Показывает карточки исполнителей и прокручивает к исполнителю из ссылки. */
export function ExpertContactsList({
  experts,
  targetExpertId,
  onOpenLogin,
}: ExpertContactsListProps) {
  const { isLoading, error } = useExpertContacts();

  useEffect(() => {
    if (isLoading || !targetExpertId) {
      return;
    }

    document
      .getElementById(`expert-contact-${targetExpertId}`)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, [isLoading, targetExpertId]);

  if (isLoading) {
    return (
      <div
        className={styles.list}
        aria-label="Загружаем исполнителей"
      >
        <ExpertCardSkeleton />
        <ExpertCardSkeleton />
        <ExpertCardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Ошибка загрузки"
        subtitle={error}
      />
    );
  }

  if (experts.length === 0) {
    return (
      <EmptyState
        title="Исполнители не найдены"
        subtitle="Попробуйте изменить поиск или фильтр доступа."
      />
    );
  }

  return (
    <div className={styles.list}>
      {experts.map((expert) => (
        <div
          key={expert.id}
          id={`expert-contact-${expert.public_id}`}
          className={cn(styles.anchor, {
            [styles.anchorTarget]: expert.public_id === targetExpertId,
          })}
        >
          <ExpertCard
            publicId={expert.public_id}
            fullName={expert.name}
            avatarUrl={expert.avatar_url}
            rating={expert.rating}
            reviewCount={expert.review_count}
            details={<ExpertContactDetails expert={expert} />}
            aside={
              <ContactAccess
                expert={expert}
                onOpenLogin={onOpenLogin}
              />
            }
          />
        </div>
      ))}
    </div>
  );
}
