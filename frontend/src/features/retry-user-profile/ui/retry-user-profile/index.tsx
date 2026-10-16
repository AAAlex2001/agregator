"use client";

import { EmptyState } from "@/shared/ui/empty-state";
import { useRetryUserProfile } from "../../model/use-retry-user-profile";

/** Даёт повторить загрузку профиля, когда сервер временно недоступен. */
export function RetryUserProfile() {
  const { error, retry } = useRetryUserProfile();

  return (
    <EmptyState
      title="Не удалось загрузить профиль"
      subtitle={error}
      actionLabel="Повторить загрузку"
      onAction={retry}
    />
  );
}
