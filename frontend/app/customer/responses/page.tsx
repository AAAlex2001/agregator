"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthHeader from "@/widgets/header/AuthHeader";
import { Loader, Title, Subtitle, Button } from "@/shared/ui";
import { useNotifications } from "@/shared/ui/Notifications";
import { ResponsesState, ResponsesTabs } from "@/widgets/responses-state";
import { ResponsesSwiper } from "@/widgets/responses-swiper";
import { CustomerResponseCard } from "@/features/response/list-customer/ui/CustomerResponseCard";
import CompletionModal from "@/features/response/complete/ui/CompletionModal";
import AddReviewModal from "@/features/response/review/ui/AddReviewModal/AddReviewModal";
import { openChatByOrder } from "@/shared/lib/chatApi";
import { loadResponses } from "@/features/response/list-expert/model/actions";
import { useResponsesState } from "@/features/response/list-expert/model/state";
import { updateResponseStatus } from "@/features/response/list-expert/model/api";
import type { ResponseCardViewModel, ResponseTabKey } from "@/features/response/list-expert/model/types";
import { createReview } from "@/features/response/list-customer/model/api";
import styles from "@/app/expert/responses/responses.module.scss";

const TAB_META: Array<{ key: ResponseTabKey; label: string }> = [
  { key: "review", label: "Новые" },
  { key: "in_progress", label: "В работе" },
  { key: "rejected", label: "Отклоненные" },
  { key: "accepted", label: "В переговорах" },
  { key: "completed", label: "Завершены" },
];

export default function CustomerResponsesPage() {
  const router = useRouter();
  const { showSuccess, showError } = useNotifications();
  const { items, counters, isLoading, error, setLoading, setError, setItems, setCounters } = useResponsesState();
  const [activeTab, setActiveTab] = useState<ResponseTabKey>("review");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [chatOpeningId, setChatOpeningId] = useState<number | null>(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewTarget, setReviewTarget] = useState<ResponseCardViewModel | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await loadResponses(
        activeTab,
        ({ items, counters }) => { setItems(items); setCounters(counters); },
        (message) => setError(message),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, [activeTab]);

  const handleStatusUpdate = async (responseId: number, newStatus: "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED") => {
    if (updatingId !== null) return false;
    setUpdatingId(responseId);
    setError(null);
    try {
      await updateResponseStatus(responseId, newStatus);
      if (newStatus === "COMPLETED") {
        const target = items.find((item) => item.id === responseId) ?? null;
        setReviewTarget(target);
        setIsCompletionModalOpen(true);
      }
      await fetchData();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить статус отклика");
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenChat = async (responseId: number, orderId: number) => {
    setChatOpeningId(responseId);
    try {
      const detail = await openChatByOrder(orderId);
      router.push(`/customer/chat/${detail.uuid}`);
    } catch (e) {
      showError(e instanceof Error ? e.message : "Не удалось открыть чат");
    } finally {
      setChatOpeningId(null);
    }
  };

  const handleInviteToChat = async (responseId: number, orderId: number) => {
    const updated = await handleStatusUpdate(responseId, "ACCEPTED");
    if (updated) await handleOpenChat(responseId, orderId);
  };

  const handleSubmitReview = async (payload: { rating: number; comment: string }) => {
    if (!reviewTarget) return;
    try {
      await createReview({
        response_id: reviewTarget.id,
        rating: payload.rating,
        comment: payload.comment,
      });
      setItems(items.map((i) => (i.id === reviewTarget.id ? { ...i, hasReview: true } : i)));
      setIsReviewModalOpen(false);
      setIsCompletionModalOpen(false);
      showSuccess("Отзыв успешно опубликован");
      await fetchData();
    } catch (e) {
      showError(e instanceof Error ? e.message : "Не удалось оставить отзыв");
    }
  };

  const tabs = TAB_META.map((meta) => ({ ...meta, count: counters[meta.key] }));
  const activeTabLabel = TAB_META.find((tab) => tab.key === activeTab)?.label ?? "На рассмотрении";

  return (
    <>
      <AuthHeader />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <Title text="Отклики по моим заказам" className={styles.pageTitle} as="h1" />
          <Subtitle text="Просматривайте и принимайте решения по откликам" className={styles.pageSubtitle} />
        </div>

        <ResponsesTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} styles={styles} />

        {isLoading ? (
          <div className={styles.statusState}>
            <Loader label="" size="lg" />
          </div>
        ) : error ? (
          <ResponsesState
            title="Ошибка загрузки"
            subtitle={error}
            styles={styles}
            action={
              <Button variant="primary" size="sm" onClick={() => void fetchData()}>
                Повторить
              </Button>
            }
          />
        ) : items.length === 0 ? (
          <ResponsesState title={activeTabLabel} subtitle="Пока нет откликов" styles={styles} />
        ) : (
          <ResponsesSwiper
            items={items}
            resetKey={activeTab}
            getKey={(r) => r.id}
            renderItem={(response) => (
              <CustomerResponseCard
                response={response}
                updatingId={updatingId}
                chatOpeningId={chatOpeningId}
                onReject={(id) => void handleStatusUpdate(id, "REJECTED")}
                onAccept={handleInviteToChat}
                onSelect={(id) => void handleStatusUpdate(id, "IN_PROGRESS")}
                onChat={handleOpenChat}
                onComplete={(id) => void handleStatusUpdate(id, "COMPLETED")}
                onLeaveReview={(r) => { setReviewTarget(r); setIsReviewModalOpen(true); }}
              />
            )}
          />
        )}
      </div>

      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
        onLeaveReview={() => {
          if (reviewTarget) {
            setIsCompletionModalOpen(false);
            setIsReviewModalOpen(true);
          }
        }}
      />

      <AddReviewModal
        isOpen={isReviewModalOpen && !!reviewTarget}
        customerName={reviewTarget?.customerCompany || reviewTarget?.customer || ""}
        orderTitle={reviewTarget?.orderTitle || ""}
        expertName={reviewTarget?.expertName || ""}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </>
  );
}
