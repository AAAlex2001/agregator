"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import AuthHeader from "@/widgets/header/AuthHeader";
import { Loader, Title, Subtitle, Button } from "@/shared/ui";
import { ResponsesState, ResponsesTabs } from "@/widgets/responses-state";
import { ArrowIcon } from "@/shared/ui/icons";
import OrderDetailsModal from "@/features/order/details/ui/OrderDetailsModal";
import type { OrderDetails, Step2FormData } from "@/features/order/details/ui/OrderDetailsModal/types";
import { useUserProfile } from "@/shared/lib/hooks/useUserProfile";
import { useNotifications } from "@/shared/ui/Notifications";
import { copyOrderLink } from "@/shared/lib/copyOrderLink";
import { openChatByOrder } from "@/shared/lib/chatApi";
import {
  AcceptedCard,
  CompletedCard,
  InProgressCard,
  RejectedCard,
  ReviewCard,
} from "@/features/response/list-expert/ui/cards";
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
  const normalized = value
    .replace(/₽/g, "")
    .replace(/\s/g, "")
    .replace(",", ".")
    .trim();

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }

  return Math.round(parsed * 100);
}

export default function ResponsesPage() {
  const router = useRouter();
  const { items, counters, isLoading, error, setLoading, setError, setItems, setCounters } = useResponsesState();
  const [activeTab, setActiveTab] = useState<ResponseTabKey>("review");
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingActionByResponseId, setLoadingActionByResponseId] = useState<Record<number, "withdraw" | "start" | "complete" | "chat" | null>>({});
  const [editingResponse, setEditingResponse] = useState<ResponseCardViewModel | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState<ResponseCardViewModel | null>(null);

  const { role } = useUserProfile();
  const isExpert = role === "EXPERT";
  const { showSuccess } = useNotifications();

  const handleShare = (publicId: string) => {
    copyOrderLink(publicId, () => showSuccess("Ссылка скопирована"));
  };

  const handleOpenChat = async (responseId: number, orderId: number) => {
    setActionLoading(responseId, "chat");
    try {
      const detail = await openChatByOrder(orderId);
      router.push(`/expert/chat/${detail.uuid}`);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось открыть чат";
      setError(message);
    } finally {
      setActionLoading(responseId, null);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      await loadResponses(
        activeTab,
        ({ items, counters }) => {
          setItems(items);
          setCounters(counters);
        },
        (message) => {
          setError(message);
        }
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchData();
  }, [activeTab]);

  useEffect(() => {
    setActiveIndex(0);
    setCurrentPage(1);
    swiperRef?.slideTo(0);
  }, [activeTab, swiperRef, items.length]);

  const setActionLoading = (responseId: number, mode: "withdraw" | "start" | "complete" | "chat" | null) => {
    setLoadingActionByResponseId((previous) => ({
      ...previous,
      [responseId]: mode,
    }));
  };

  const handleWithdrawReview = async (responseId: number) => {
    setActionLoading(responseId, "withdraw");
    try {
      await withdrawResponse(responseId);
      await fetchData();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось отозвать отклик";
      setError(message);
    } finally {
      setActionLoading(responseId, null);
    }
  };

  const handleRejectResponse = async (responseId: number) => {
    setActionLoading(responseId, "withdraw");
    try {
      await withdrawResponse(responseId);
      await fetchData();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось отозвать отклик";
      setError(message);
    } finally {
      setActionLoading(responseId, null);
    }
  };

  const handleOpenEditModal = (response: ResponseCardViewModel) => {
    setEditingResponse(response);
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
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось обновить отклик";
      setError(message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleStartOrComplete = async (responseId: number, isInProgress: boolean) => {
    setActionLoading(responseId, isInProgress ? "complete" : "start");
    try {
      await updateResponseStatus(responseId, isInProgress ? "COMPLETED" : "IN_PROGRESS");
      await fetchData();
    } catch (caughtError) {
      const message = caughtError instanceof Error
        ? caughtError.message
        : isInProgress
          ? "Не удалось завершить проект"
          : "Не удалось перевести проект в работу";
      setError(message);
    } finally {
      setActionLoading(responseId, null);
    }
  };

  const tabs = [
    { key: "review" as const, label: "На рассмотрении", count: counters.review },
    { key: "in_progress" as const, label: "В работе", count: counters.in_progress },
    { key: "rejected" as const, label: "Отклоненные", count: counters.rejected },
    { key: "accepted" as const, label: "В переговорах", count: counters.accepted },
    { key: "completed" as const, label: "Завершены", count: counters.completed },
  ];

  const totalPages = Math.max(1, items.length);
  const activeTabLabel = TAB_META.find((tab) => tab.key === activeTab)?.label ?? "На рассмотрении";

  const paginationItems: (number | "ellipsis")[] = (() => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, "ellipsis", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  })();

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    setCurrentPage(swiper.realIndex + 1);
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    swiperRef?.slideTo(page - 1);
  };

  const handlePrev = () => {
    swiperRef?.slidePrev();
  };

  const handleNext = () => {
    swiperRef?.slideNext();
  };

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
          <div className={styles.cardsSection}>
            <div className={styles.shadeLeft} />
            <div className={styles.shadeRight} />
            <Swiper
              className={styles.swiper}
              modules={[Navigation]}
              slidesPerView="auto"
              spaceBetween={16}
              centeredSlides
              loop={false}
              breakpoints={{
                768: {
                  spaceBetween: 20,
                },
              }}
              onSwiper={setSwiperRef}
              onSlideChange={handleSlideChange}
            >
              {items.map((response, index) => (
                <SwiperSlide key={response.id} className={styles.slide}>
                  <div className={`${styles.slideInner} ${index === activeIndex ? styles.slideActive : ""}`}>
                    {(() => {
                      const actionLoading = loadingActionByResponseId[response.id] ?? null;

                      switch (response.rawStatus) {
                        case "REVIEW":
                          return (
                            <ReviewCard
                              dateLabel={response.dateLabel}
                              date={response.date}
                              status={response.status}
                              statusColor={response.statusColor}
                              statusBg={response.statusBg}
                              orderTitle={response.orderTitle}
                              customer={response.customerCompany || response.customer}
                              orderDate={response.orderDate}
                              badges={response.badges}
                              sum={response.orderCustomerSum || response.sum}
                              deadline={response.deadline}
                              costEstimate={response.costEstimate}
                              commissionText={response.commissionText}
                              commissionAmount={response.commissionAmount}
                              commissionStatus={response.commissionStatus}
                              balanceReturnText={response.balanceReturnText}
                              balanceReturnAmount={response.balanceReturnAmount}
                              commentTitle={response.commentTitle}
                              commentText={response.commentText}
                              orderComment={response.orderComment}
                              techSpecTitle={response.techSpecTitle}
                              techSpecFiles={response.techSpecFiles}
                              orderTechSpecFiles={response.orderTechSpecFiles}
                              onWithdraw={() => setWithdrawTarget(response)}
                              onChangeOffer={() => handleOpenEditModal(response)}
                              onShare={() => handleShare(response.orderPublicId)}
                              isWithdrawLoading={actionLoading === "withdraw"}
                            />
                          );
                        case "ACCEPTED":
                          return (
                            <AcceptedCard
                              dateLabel={response.dateLabel}
                              date={response.date}
                              status={response.status}
                              statusColor={response.statusColor}
                              statusBg={response.statusBg}
                              orderTitle={response.orderTitle}
                              customer={response.customerCompany || response.customer}
                              orderDate={response.orderDate}
                              badges={response.badges}
                              sum={response.orderCustomerSum || response.sum}
                              deadline={response.deadline}
                              costEstimate={response.costEstimate}
                              commissionText={response.commissionText}
                              commissionAmount={response.commissionAmount}
                              commissionStatus={response.commissionStatus}
                              balanceReturnText={response.balanceReturnText}
                              balanceReturnAmount={response.balanceReturnAmount}
                              commentTitle={response.commentTitle}
                              commentText={response.commentText}
                              orderComment={response.orderComment}
                              techSpecTitle={response.techSpecTitle}
                              techSpecFiles={response.techSpecFiles}
                              orderTechSpecFiles={response.orderTechSpecFiles}
                              reminderText={response.reminderText}
                              onReject={() => setWithdrawTarget(response)}
                              onChat={() => void handleOpenChat(response.id, response.orderId)}
                              onShare={() => handleShare(response.orderPublicId)}
                              isRejectLoading={actionLoading === "withdraw"}
                              isChatLoading={actionLoading === "chat"}
                            />
                          );
                        case "IN_PROGRESS":
                          return (
                            <InProgressCard
                              dateLabel={response.dateLabel}
                              date={response.date}
                              status={response.status}
                              statusColor={response.statusColor}
                              statusBg={response.statusBg}
                              statusMessage={response.statusMessage}
                              orderTitle={response.orderTitle}
                              customer={response.customerCompany || response.customer}
                              orderDate={response.orderDate}
                              badges={response.badges}
                              sum={response.orderCustomerSum || response.sum}
                              deadline={response.deadline}
                              costEstimate={response.costEstimate}
                              commissionText={response.commissionText}
                              commissionAmount={response.commissionAmount}
                              commissionStatus={response.commissionStatus}
                              balanceReturnText={response.balanceReturnText}
                              balanceReturnAmount={response.balanceReturnAmount}
                              commentTitle={response.commentTitle}
                              commentText={response.commentText}
                              orderComment={response.orderComment}
                              techSpecTitle={response.techSpecTitle}
                              techSpecFiles={response.techSpecFiles}
                              orderTechSpecFiles={response.orderTechSpecFiles}
                              reminderText={response.reminderText}
                              expertConfirmed={response.expertConfirmed}
                              onReject={() => setWithdrawTarget(response)}
                              onChat={() => void handleOpenChat(response.id, response.orderId)}
                              onShare={() => handleShare(response.orderPublicId)}
                              onAcceptProject={() => void handleStartOrComplete(response.id, false)}
                              onComplete={() => void handleStartOrComplete(response.id, true)}
                              isRejectLoading={actionLoading === "withdraw"}
                              isChatLoading={actionLoading === "chat"}
                              isAcceptProjectLoading={actionLoading === "start"}
                              isCompleteLoading={actionLoading === "complete"}
                            />
                          );
                        case "REJECTED":
                          return (
                            <RejectedCard
                              dateLabel={response.dateLabel}
                              date={response.date}
                              status={response.status}
                              statusColor={response.statusColor}
                              statusBg={response.statusBg}
                              orderTitle={response.orderTitle}
                              customer={response.customerCompany || response.customer}
                              orderDate={response.orderDate}
                              badges={response.badges}
                              sum={response.orderCustomerSum || response.sum}
                              deadline={response.deadline}
                              costEstimate={response.costEstimate}
                              commissionText={response.commissionText}
                              commissionAmount={response.commissionAmount}
                              commissionStatus={response.commissionStatus}
                              commentTitle={response.commentTitle}
                              commentText={response.commentText}
                              techSpecTitle={response.techSpecTitle}
                              techSpecFiles={response.techSpecFiles}
                              onShare={() => handleShare(response.orderPublicId)}
                            />
                          );
                        case "COMPLETED":
                          return (
                            <CompletedCard
                              dateLabel={response.dateLabel}
                              date={response.date}
                              status={response.status}
                              statusColor={response.statusColor}
                              statusBg={response.statusBg}
                              orderTitle={response.orderTitle}
                              customer={response.customerCompany || response.customer}
                              orderDate={response.orderDate}
                              badges={response.badges}
                              sum={response.orderCustomerSum || response.sum}
                              deadline={response.deadline}
                              costEstimate={response.costEstimate}
                              commissionText={response.commissionText}
                              commissionAmount={response.commissionAmount}
                              commissionStatus={response.commissionStatus}
                              balanceReturnText={response.balanceReturnText}
                              balanceReturnAmount={response.balanceReturnAmount}
                              commentTitle={response.commentTitle}
                              commentText={response.commentText}
                              orderComment={response.orderComment}
                              techSpecTitle={response.techSpecTitle}
                              techSpecFiles={response.techSpecFiles}
                              orderTechSpecFiles={response.orderTechSpecFiles}
                              onShare={() => handleShare(response.orderPublicId)}
                            />
                          );
                        default:
                          return null;
                      }
                    })()}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={styles.pagination}>
              <button className={styles.slideBtn} onClick={handlePrev} aria-label="Назад">
                <ArrowIcon className={styles.arrowLeft} color="#FFDDA9" />
              </button>

              <div className={styles.pages}>
                {paginationItems.map((item, index) => {
                  if (item === "ellipsis") {
                    return (
                      <span key={`ellipsis-${index}`} className={styles.pageBtn} aria-hidden="true">
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={item}
                      className={`${styles.pageBtn} ${item === currentPage ? styles.pageBtnActive : ""}`}
                      onClick={() => handlePageClick(item)}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              <button className={styles.slideBtn} onClick={handleNext} aria-label="Вперед">
                <ArrowIcon color="#FFDDA9" />
              </button>
            </div>
          </div>
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
                costEstimate: editingResponse.rawSumAmount > 0
                  ? String(editingResponse.rawSumAmount / 100)
                  : "",
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
