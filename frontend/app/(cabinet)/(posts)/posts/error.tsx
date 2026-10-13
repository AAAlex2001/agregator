"use client";

import { EmptyState } from "@/source/shared/ui/EmptyState";

interface PostsErrorProps {
  reset: () => void;
}

/** Раздел публикаций не загрузился: сервер недоступен или ответил ошибкой. */
export default function PostsError({ reset }: PostsErrorProps) {
  return (
    <EmptyState
      title="Не удалось загрузить публикации"
      subtitle="Сервер сейчас не отвечает. Попробуйте ещё раз через минуту."
      actionLabel="Повторить"
      onAction={reset}
    />
  );
}
