"use client";

import { useState } from "react";
import { CUSTOMER_RESPONSE_TABS, EXPERT_RESPONSE_TABS, useResponses } from "@/entities/response";
import type {
  ResponseItem,
  ResponseQuery,
  ResponseSort as ResponseSortValue,
  ResponseTab,
  ResponseViewer,
} from "@/entities/response";
import { LeaveReviewModal } from "@/features/leave-review";
import { ResponseSort } from "@/features/sort-responses";
import { Tabs } from "@/shared/ui/tabs";
import { CompletionModal } from "../completion-modal";
import { ResponsesList } from "../responses-list";
import styles from "./style.module.scss";

/** Сторона просмотра, вкладка из адреса и переход в открытый чат. */
interface ResponsesProps {
  viewer: ResponseViewer;
  initialTab: ResponseTab;
  onOpenChat: (chatUuid: string) => void;
}

/** Отклики исполнителя или заказчика по вкладкам статусов с действиями над ними. */
export function Responses({ viewer, initialTab, onOpenChat }: ResponsesProps) {
  const [query, setQuery] = useState<ResponseQuery>({
    tab: initialTab,
    sort: {
      field: null,
      direction: null,
    },
  });
  const [completedResponse, setCompletedResponse] = useState<ResponseItem | null>(null);
  const [reviewResponse, setReviewResponse] = useState<ResponseItem | null>(null);
  const responses = useResponses(query);
  const isCustomer = viewer === "CUSTOMER";
  const tabs = isCustomer ? CUSTOMER_RESPONSE_TABS : EXPERT_RESPONSE_TABS;
  const activeTab = tabs.find((tab) => tab.id === query.tab);

  /** Открывает вкладку с откликами выбранного статуса. */
  function changeTab(id: string) {
    const tab = tabs.find((item) => item.id === id);

    if (tab) {
      setQuery({ ...query, tab: tab.id });
    }
  }

  /** Перечитывает отклики в выбранном порядке. */
  function changeSort(sort: ResponseSortValue) {
    setQuery({ ...query, sort });
  }

  /** Загружает список заново после действия над откликом. */
  function reload() {
    setQuery({ ...query });
  }

  /** Обновляет список и предлагает отзыв о только что завершённом проекте. */
  function finishProject(response: ResponseItem) {
    setCompletedResponse(response);
    reload();
  }

  /** Закрывает сообщение о завершении проекта. */
  function closeCompletion() {
    setCompletedResponse(null);
  }

  /** Переходит от сообщения о завершении к отзыву. */
  function reviewCompletedProject() {
    setReviewResponse(completedResponse);
    setCompletedResponse(null);
  }

  /** Закрывает форму отзыва и удаляет её черновик. */
  function closeReview() {
    setReviewResponse(null);
  }

  /** Убирает кнопку отзыва после публикации. */
  function finishReview() {
    setReviewResponse(null);
    reload();
  }

  return (
    <div className={styles.wrapper}>
      <Tabs
        variant="pill"
        tabs={tabs.map((tab) => ({
          id: tab.id,
          label: tab.label,
          count: responses.counters[tab.id],
        }))}
        activeTab={query.tab}
        onTabChange={changeTab}
        className={styles.tabs}
      />
      {isCustomer && (
        <div className={styles.sortRow}>
          <ResponseSort
            sort={query.sort}
            onChange={changeSort}
          />
        </div>
      )}
      <div className={styles.body}>
        <ResponsesList
          responses={responses}
          viewer={viewer}
          tabLabel={activeTab?.label ?? ""}
          isRejectedTab={query.tab === "rejected"}
          onReload={reload}
          onCompleted={finishProject}
          onLeaveReview={setReviewResponse}
          onOpenChat={onOpenChat}
        />
      </div>

      {completedResponse && (
        <CompletionModal
          onClose={closeCompletion}
          onLeaveReview={reviewCompletedProject}
        />
      )}
      {reviewResponse && (
        <LeaveReviewModal
          key={reviewResponse.id}
          responseId={reviewResponse.id}
          customerName={reviewResponse.customer_company || reviewResponse.customer_name}
          orderTitle={reviewResponse.order_title}
          expertName={reviewResponse.expert_name}
          onClose={closeReview}
          onPublished={finishReview}
        />
      )}
    </div>
  );
}
