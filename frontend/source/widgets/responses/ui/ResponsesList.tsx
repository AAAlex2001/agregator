import type { ReactNode } from "react";
import { Button } from "@/shared/ui";
import Loader from "@/source/shared/ui/Loader";
import { EmptyStateCard } from "@/source/shared/ui";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import Tabs from "@/source/shared/ui/Tabs";
import { ResponsesState } from "@/widgets/responses-state";
import { ResponseCard } from "@/source/entities/response";
import type { ResponseTabKey, UserRole } from "@/source/entities/response";
import { getCardActions } from "@/source/features/responses";
import type { useResponses } from "@/source/features/responses";
import { useInfiniteScroll } from "@/source/shared/lib/useInfiniteScroll";
import { ResponsesSkeleton } from "./ResponsesSkeleton";
import s from "./ResponsesWidget.module.scss";

type ResponsesModel = ReturnType<typeof useResponses>;

interface Props {
  role: UserRole;
  title: string;
  subtitle: string;
  model: ResponsesModel;
  actionHandlers: Parameters<typeof getCardActions>[3];
  sortSlot?: ReactNode;
  topSlot?: ReactNode;
}

export function ResponsesList({ role, title, subtitle, model, actionHandlers, sortSlot, topSlot }: Props) {
  const activeLabel = model.tabs.find((tab) => tab.id === model.activeTab)?.label ?? "";

  const sentinelRef = useInfiniteScroll({
    hasMore: model.hasMore,
    isLoading: model.isLoading || model.isLoadingMore,
    onLoadMore: () => void model.loadMore(),
  });

  return (
    <div className={s.wrapper}>
      <div className={s.pageHead}>
        <Title text={title} as="h1" className={s.pageTitle} />
        <Subtitle text={subtitle} className={s.pageSubtitle} />
      </div>

      <div className={s.contentArea}>
        {topSlot}
        <Tabs
          variant="pill"
          tabs={model.tabs.map((tab) => ({ id: tab.id, label: tab.label, count: tab.count }))}
          activeTab={model.activeTab}
          onTabChange={(id) => model.setTab(id as ResponseTabKey)}
          className={s.tabs}
        />

        {sortSlot && <div className={s.sortRow}>{sortSlot}</div>}

        <div className={s.contentBody}>
          {model.isLoading ? (
            <ResponsesSkeleton compact hideTabs />
          ) : model.error ? (
            <ResponsesState
              title="Ошибка загрузки"
              subtitle={model.error}
              styles={s}
              action={<Button variant="primary" size="sm" onClick={() => void model.reload()}>Повторить</Button>}
            />
          ) : model.items.length === 0 ? (
            <div className={s.emptyState}>
              <EmptyStateCard
                title="Пока нет откликов"
                subtitle={activeLabel ? `В разделе «${activeLabel}» пока пусто` : "Здесь пока нет откликов"}
              />
            </div>
          ) : (
            <>
              <div className={s.list}>
                {model.items.map((item) => (
                  <ResponseCard
                    key={item.id}
                    card={item}
                    role={role}
                    actions={getCardActions(item, model.actionLoading[item.id] ?? null, role, actionHandlers)}
                  />
                ))}
                {model.isLoadingMore && (
                  <div className={s.loadMore}>
                    <Loader label="" size="md" />
                  </div>
                )}
              </div>
              <div ref={sentinelRef} aria-hidden="true" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
