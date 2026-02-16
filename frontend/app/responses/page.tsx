"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import AuthHeader from "@/app/landing/header/AuthHeader";
import { Loader, ResponseCard, Title, Subtitle, Button } from "@/app/components";
import { ArrowIcon } from "@/app/icons";
import OrderDetailsModal from "@/app/expert/orders/components/OrderDetailsModal";
import type { OrderDetails, Step2FormData } from "@/app/expert/orders/components/OrderDetailsModal/types";
import { ResponsesState, ResponsesTabs } from "./components";
import { loadResponses } from "./store/actions";
import { updateResponseStatus, updateExistingResponse, withdrawResponse } from "./store/api";
import { useResponsesState } from "./store/state";
import type { ResponseCardViewModel, ResponseTabKey } from "./store/types";
import styles from "./responses.module.scss";

const TAB_META: Array<{ key: ResponseTabKey; label: string }> = [
  { key: "all", label: "Все" },
  { key: "review", label: "На рассмотрении" },
  { key: "rejected", label: "Отклоненные" },
  { key: "accepted", label: "Принятые" },
  { key: "completed", label: "Завершены" },
  { key: "archive", label: "Архив" },
];

export default function ResponsesPage() {
  const { items, counters, isLoading, error, setLoading, setError, setItems, setCounters } = useResponsesState();
  const [activeTab, setActiveTab] = useState<ResponseTabKey>("all");
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingActionByResponseId, setLoadingActionByResponseId] = useState<Record<number, "withdraw" | "start" | "complete" | null>>({});
  const [editingResponse, setEditingResponse] = useState<ResponseCardViewModel | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);

  const isExpert = typeof window !== "undefined" && window.localStorage.getItem("user_role") === "EXPERT";

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
    swiperRef?.slideToLoop(0);
  }, [activeTab, swiperRef, items.length]);

  const setActionLoading = (responseId: number, mode: "withdraw" | "start" | "complete" | null) => {
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
        sum: editingResponse.orderCustomerSum || editingResponse.sum,
        commissionAmount: editingResponse.orderCommissionAmount,
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
    { key: "all" as const, label: "Все", count: counters.all },
    { key: "review" as const, label: "На рассмотрении", count: counters.review },
    { key: "rejected" as const, label: "Отклоненные", count: counters.rejected },
    { key: "accepted" as const, label: "Принятые", count: counters.accepted },
    { key: "completed" as const, label: "Завершены", count: counters.completed },
    { key: "archive" as const, label: "Архив", count: counters.archive },
  ];

  const totalPages = Math.max(1, items.length);
  const activeTabLabel = TAB_META.find((tab) => tab.key === activeTab)?.label ?? "Все";

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
    swiperRef?.slideToLoop(page - 1);
  };

  const handlePrev = () => {
    swiperRef?.slidePrev();
  };

  const handleNext = () => {
    swiperRef?.slideNext();
  };

  return (
    <>
      <AuthHeader
        name="Иван Иванов"
        rating={4.8}
        reviewCount={12}
        balance="150 000"
      />
      <div className={styles.wrapper}>
        <div className={styles.pageHead}>
          <Title text="Все отклики" className={styles.pageTitle} as="h1" />
          <Subtitle text="Отслеживайте статус ваших откликов" className={styles.pageSubtitle} />
        </div>

        <ResponsesTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {isLoading ? (
          <div className={styles.statusState}>
            <Loader label="" size="lg" />
          </div>
        ) : error ? (
          <ResponsesState
            title="Ошибка загрузки"
            subtitle={error}
            action={
              <Button variant="primary" size="sm" onClick={() => void fetchData()}>
                Повторить
              </Button>
            }
          />
        ) : items.length === 0 ? (
          <ResponsesState title={activeTabLabel} subtitle="Пока нет откликов" />
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
              loop={items.length > 1}
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
                      const isReview = isExpert && response.rawStatus === "REVIEW";
                      const isAcceptanceRequest = isExpert && response.rawStatus === "ACCEPTED";
                      const isInProgress = isExpert && response.rawStatus === "IN_PROGRESS";
                      const isExpertActionable = isReview || isAcceptanceRequest || isInProgress;
                      const isCompletedCard = response.rawStatus === "COMPLETED";
                      const actionLoading = loadingActionByResponseId[response.id] ?? null;

                      const getEditBtnText = () => {
                        if (isReview) return "Редактировать";
                        if (isAcceptanceRequest) return "Отклонить";
                        if (isInProgress) return "Отклонить отклик";
                        return undefined;
                      };

                      const getPayBtnText = () => {
                        if (isReview) return "Отозвать отклик";
                        if (isAcceptanceRequest) return "Принять проект";
                        if (isInProgress) return "Завершить проект";
                        return undefined;
                      };

                      return (
                    <ResponseCard
                      dateLabel={response.dateLabel}
                      date={response.date}
                      status={response.status}
                      statusColor={response.statusColor}
                      statusBg={response.statusBg}
                      statusMessage={isAcceptanceRequest ? response.statusMessage : undefined}
                      orderTitle={response.orderCustomerSum || response.orderTitle}
                      customer={response.customerCompany || response.customer}
                      orderDate={response.orderDate}
                      badges={response.badges}
                      sum={response.orderCustomerSum || response.sum}
                      collapsibleOrderMeta
                      deadline={response.deadline}
                      costEstimate={response.costEstimate}
                      commissionText={response.commissionText}
                      commissionAmount={response.commissionAmount}
                      commissionStatus={isAcceptanceRequest ? response.commissionStatus : undefined}
                      balanceReturnText={isAcceptanceRequest ? response.balanceReturnText : undefined}
                      balanceReturnAmount={isAcceptanceRequest ? response.balanceReturnAmount : undefined}
                      commentTitle={response.commentTitle}
                      commentText={response.commentText}
                      techSpecTitle={response.techSpecTitle}
                      techSpecFiles={response.techSpecFiles}
                      reminderText={isAcceptanceRequest ? response.reminderText : undefined}
                      editBtnText={getEditBtnText()}
                      editBtnVariant={isReview ? "outlineOrange" : "outline"}
                      middleBtnText={isAcceptanceRequest ? "Перейти в чат" : undefined}
                      middleBtnVariant={isAcceptanceRequest ? "secondary" : undefined}
                      onMiddle={isAcceptanceRequest ? () => { /* TODO: navigate to chat */ } : undefined}
                      payBtnText={getPayBtnText()}
                      payBtnVariant={isReview ? "outline" : "green"}
                      showActions={!isCompletedCard && isExpertActionable}
                      onEdit={isReview ? () => handleOpenEditModal(response) : isExpertActionable ? () => void handleRejectResponse(response.id) : undefined}
                      onPay={isReview ? () => void handleWithdrawReview(response.id) : isExpertActionable ? () => void handleStartOrComplete(response.id, isAcceptanceRequest ? false : true) : undefined}
                      isEditLoading={!isReview && actionLoading === "withdraw"}
                      isPayLoading={isReview ? actionLoading === "withdraw" : (actionLoading === "start" || actionLoading === "complete")}
                    />
                      );
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
              }
            : undefined
        }
        submitLabel="Сохранить"
      />
    </>
  );
}
