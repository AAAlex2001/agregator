"use client";

import { EmptyState } from "@/shared/ui/empty-state";

/** Повторная отрисовка раздела после ошибки загрузки. */
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
