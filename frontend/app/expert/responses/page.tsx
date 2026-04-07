"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthHeader from "@/widgets/header/AuthHeader";
import { Loader, Title, Subtitle, Button } from "@/shared/ui";
import { ResponsesState, ResponsesTabs } from "@/widgets/responses-state";
import { ResponsesSwiper } from "@/widgets/responses-swiper";
import OrderDetailsModal from "@/features/order/details/ui/OrderDetailsModal";
import type { OrderDetails, Step2FormData } from "@/features/order/details/ui/OrderDetailsModal/types";
import { useUserProfile } from "@/shared/lib/hooks/useUserProfile";
import { useNotifications } from "@/shared/ui/Notifications";
import { copyOrderLink } from "@/shared/lib/copyOrderLink";
import { openChatByOrder } from "@/shared/lib/chatApi";
import { ExpertResponseCard } from "@/features/response/list-expert/ui/ExpertResponseCard";
import WithdrawConfirmModal from "@/features/balance/withdraw/ui/WithdrawConfirmModal/WithdrawConfirmModal";
import { loadResponses } from "@/features/response/list-expert/model/actions";
import { updateResponseStatus, updateExistingResponse, withdrawResponse } from "@/features/response/list-expert/model/api";
import { useResponsesState } from "@/features/response/list-expert/model/state";
import type { ResponseCardViewModel, ResponseTabKey } from "@/features/response/list-expert/model/types";
import styles from "./responses.module.scss";

const TAB_META: Array<{ key: ResponseTabKey; label: string }> = [
  { key: "review", label: "На рассмотрении" },
  { key: "in_progress", label: "В работе" },
  { key: "rejected", label: "Отклоненные" },
  { key: "accepted", label: "В переговорах" },
  { key: "completed", label: "Завершены" },
];

function parseDisplayAmountToKopecks(value: string): number {
  const normalized = value.replace(/₽/g, "").replace(/\s/g, "").replace(",", ".").trim();
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  return Math.round(parsed * 100);
}

export default function ResponsesPage() {
  const router = useRouter();
  const { items, counters, isLoading, error, setLoading, setError, setItems, setCounters } = useResponsesState();
  const [activeTab, setActiveTab] = useState<ResponseTabKey>("review");
  const [loadingActionByResponseId, setLoadingActionByResponseId] = useState<Record<number, "withdraw" | "start" | "complete" | "chat" | null>>({});
  const [editingResponse, setEditingResponse] = useState<ResponseCardViewModel | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState<ResponseCardViewModel | null>(null);

  useUserProfile();
  const { showSuccess } = useNotifications();

  const setActionLoading = (responseId: number, mode: "withdraw" | "start" | "complete" | "chat" | null) => {
    setLoadingActionByResponseId((prev) => ({ ...prev, [responseId]: mode }));
  };

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

  const handleShare = (publicId: string) => {
    copyOrderLink(publicId, () => showSuccess("Ссылка скопирована"));
  };

  const handleOpenChat = async (responseId: number, orderId: number) => {
    setActionLoading(responseId, "chat");
    try {
      const detail = await openChatByOrder(orderId);
      router.push(`/expert/chat/${detail.uuid}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось открыть чат");
    } finally {
      setActionLoading(responseId, null);
    }
  };

  const handleWithdrawReview = async (responseId: number) => {
    setActionLoading(responseId, "withdraw");
    try {
      await withdrawResponse(responseId);
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось отозвать отклик");
    } finally {
      setActionLoading(responseId, null);
    }
  };

  const handleStartOrComplete = async (responseId: number, isInProgress: boolean) => {
    setActionLoading(responseId, isInProgress ? "complete" : "start");
    try {
      await updateResponseStatus(responseId, isInProgress ? "COMPLETED" : "IN_PROGRESS");
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : isInProgress ? "Не удалось завершить проект" : "Не удалось перевести проект в работу");
    } finally {
      setActionLoading(responseId, null);
    }
  };

  const editOrderDetails: OrderDetails | null = editingResponse
    ? {
        id: editingResponse.orderId,
        badges: editingResponse.badges,
        title: editingResponse.orderTitle,
        customer: editingResponse.customerCompany || editingResponse.customer,
        date: editingResponse.orderDate,
        deadlineRaw: editingResponse.orderDate,
        sum: editingResponse.orderCustomerSum || editingResponse.sum,
        sumAmountRaw: parseDisplayAmountToKopecks(editingResponse.orderCustomerSum || editingResponse.sum),
        commissionAmount: editingResponse.orderCommissionAmount,
        commissionAmountRaw: parseDisplayAmountToKopecks(editingResponse.orderCommissionAmount),
        comment: "",
        technicalFiles: editingResponse.techSpecFiles || [],
      }
    : null;

  const handleEditSubmit = async (_order: OrderDetails, formData: Step2FormData) => {
    if (!editingResponse) return;
    setIsEditSubmitting(true);
    try {
      await updateExistingResponse(editingResponse.id, {
        comment: formData.comment,
        proposed_sum_amount: formData.costEstimate,
        proposed_deadline: formData.deadline,
        files: formData.files,
        keepFiles: formData.keepFiles,
      });
      setEditingResponse(null);
      await fetchData();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить отклик");
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const tabs = TAB_META.map((meta) => ({ ...meta, count: counters[meta.key] }));
  const activeTabLabel = TAB_META.find((tab) => tab.key === activeTab)?.label ?? "На рассмотрении";

  return (
    <>
      <AuthHeader />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <Title text="Все отклики" className={styles.pageTitle} as="h1" />
          <Subtitle text="Отслеживайте статус ваших откликов" className={styles.pageSubtitle} />
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
              <ExpertResponseCard
                response={response}
                actionLoading={loadingActionByResponseId[response.id] ?? null}
                onWithdraw={setWithdrawTarget}
                onChangeOffer={setEditingResponse}
                onShare={handleShare}
                onChat={handleOpenChat}
                onStart={(id) => void handleStartOrComplete(id, false)}
                onComplete={(id) => void handleStartOrComplete(id, true)}
              />
            )}
          />
        )}
      </div>

      <OrderDetailsModal
        isOpen={Boolean(editingResponse)}
        order={editOrderDetails}
        onClose={() => setEditingResponse(null)}
        onRespond={handleEditSubmit}
        isResponding={isEditSubmitting}
        initialStep="step2"
        initialData={
          editingResponse
            ? {
                deadline: editingResponse.rawDeadline || "",
                costEstimate: editingResponse.rawSumAmount > 0 ? String(editingResponse.rawSumAmount / 100) : "",
                comment: editingResponse.commentText,
                existingFiles: editingResponse.techSpecFiles ?? [],
                dateLabel: editingResponse.dateLabel,
                date: editingResponse.date,
                status: editingResponse.status,
                statusColor: editingResponse.statusColor,
                statusBg: editingResponse.statusBg,
              }
            : undefined
        }
        submitLabel="Сохранить"
      />

      <WithdrawConfirmModal
        isOpen={Boolean(withdrawTarget)}
        onCancel={() => setWithdrawTarget(null)}
        onConfirm={() => {
          if (!withdrawTarget) return;
          void handleWithdrawReview(withdrawTarget.id);
          setWithdrawTarget(null);
        }}
        isLoading={withdrawTarget ? loadingActionByResponseId[withdrawTarget.id] === "withdraw" : false}
        dateLabel={withdrawTarget?.dateLabel ?? ""}
        date={withdrawTarget?.date ?? ""}
        status={withdrawTarget?.status ?? ""}
        statusColor={withdrawTarget?.statusColor ?? ""}
        statusBg={withdrawTarget?.statusBg ?? ""}
        orderTitle={withdrawTarget?.orderTitle ?? ""}
        customer={withdrawTarget?.customerCompany || (withdrawTarget?.customer ?? "")}
        orderDate={withdrawTarget?.orderDate ?? ""}
        badges={withdrawTarget?.badges ?? []}
        sum={withdrawTarget?.orderCustomerSum || (withdrawTarget?.sum ?? "")}
        balanceReturnAmount={withdrawTarget?.balanceReturnAmount}
      />
    </>
  );
}
