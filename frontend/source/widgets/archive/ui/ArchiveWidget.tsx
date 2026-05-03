"use client";

import { useArchive } from "@/source/features/archive-orders";
import { ResponsesSwiper } from "@/widgets/responses-swiper";
import { ResponsesSkeleton } from "@/source/widgets/responses/ui/ResponsesSkeleton";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import { ArchivedCard } from "./ArchivedCard";
import s from "./ArchiveWidget.module.scss";

export function ArchiveWidget() {
  const { items, isLoading, error } = useArchive();

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text="Архив заказов" as="h1" className={s.pageTitle} />
        <Subtitle text="Здесь находятся завершенные заказы" className={s.pageSubtitle} />
      </div>

      <div className={s.contentArea}>
        <div className={s.contentBody}>
          {isLoading ? (
            <ResponsesSkeleton compact hideTabs />
          ) : error ? (
            <div className={s.empty}>
              <EmptyStateCard title="Ошибка загрузки" subtitle={error} />
            </div>
          ) : items.length === 0 ? (
            <div className={s.empty}>
              <EmptyStateCard
                title="Архив пуст"
                subtitle="Здесь будут завершённые заказы"
              />
            </div>
          ) : (
            <ResponsesSwiper
              items={items}
              getKey={(item) => item.id}
              renderItem={(item) => <ArchivedCard card={item} />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
