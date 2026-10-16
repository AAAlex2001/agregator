"use client";

import { hasResponseActions, ResponseCardSkeleton } from "@/entities/response";
import type { ResponseItem, ResponsesResult, ResponseViewer } from "@/entities/response";
import { DeleteRejectedResponsesButton } from "@/features/delete-rejected-responses";
import { useInfiniteScroll } from "@/shared/lib/use-infinite-scroll";
import { EmptyState } from "@/shared/ui/empty-state";
import { Loader } from "@/shared/ui/loader";
import { CustomerResponseActions } from "../customer-response-actions";
import { ExpertResponseActions } from "../expert-response-actions";
import { ResponseCard } from "../response-card";
import styles from "./style.module.scss";

/** Загруженные отклики вкладки, сторона просмотра и действия над ними. */
interface ResponsesListProps {
  responses: ResponsesResult;
  viewer: ResponseViewer;
  tabLabel: string;
  isRejectedTab: boolean;
  onReload: () => void;
  onCompleted: (response: ResponseItem) => void;
  onLeaveReview: (response: ResponseItem) => void;
  onOpenChat: (chatUuid: string) => void;
}

/** Показывает отклики вкладки и догружает их при прокрутке. */
export function ResponsesList({
  responses,
  viewer,
  tabLabel,
  isRejectedTab,
  onReload,
  onCompleted,
  onLeaveReview,
  onOpenChat,
}: ResponsesListProps) {
  const sentinelRef = useInfiniteScroll({
    hasMore: responses.hasMore,
    isLoading: responses.isLoading || responses.isLoadingMore,
    onLoadMore: responses.loadMore,
  });
  const canDeleteRejected = viewer === "CUSTOMER" && isRejectedTab;

  if (responses.isLoading) {
    return (
      <div
        className={styles.list}
        aria-hidden="true"
      >
        <ResponseCardSkeleton />
        <ResponseCardSkeleton />
        <ResponseCardSkeleton />
      </div>
    );
  }

  if (responses.error) {
    return (
      <EmptyState
        title="Ошибка загрузки"
        subtitle={responses.error}
        actionLabel="Повторить"
        onAction={onReload}
      />
    );
  }

  if (responses.items.length === 0) {
    return (
      <EmptyState
        title="Пока нет откликов"
        subtitle={`В разделе «${tabLabel}» пока пусто`}
      />
    );
  }

  return (
    <>
      {canDeleteRejected && (
        <div className={styles.topActions}>
          <DeleteRejectedResponsesButton
            count={responses.items.length}
            onDeleted={onReload}
          />
        </div>
      )}
      <div className={styles.list}>
        {responses.items.map((response) => {
          const actions = viewer === "EXPERT" ? (
            <ExpertResponseActions
              response={response}
              onChanged={onReload}
              onOpenChat={onOpenChat}
            />
          ) : (
            <CustomerResponseActions
              response={response}
              onChanged={onReload}
              onCompleted={onCompleted}
              onLeaveReview={onLeaveReview}
              onOpenChat={onOpenChat}
            />
          );

          return (
            <ResponseCard
              key={response.id}
              response={response}
              viewer={viewer}
              actions={hasResponseActions(response, viewer) ? actions : undefined}
            />
          );
        })}
        {responses.isLoadingMore && (
          <div className={styles.loadMore}>
            <Loader
              label=""
              size="md"
            />
          </div>
        )}
      </div>
      <div
        ref={sentinelRef}
        aria-hidden="true"
      />
    </>
  );
}
