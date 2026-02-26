"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

import AuthHeader from "@/app/landing/header/AuthHeader";
import { Loader, Title, Subtitle, Button } from "@/app/components";
import { useNotifications } from "@/app/components/Notifications";
import { ResponsesState, ResponsesTabs } from "@/app/components/Responses";
import {
  ReviewCard,
  AcceptedCard,
  InProgressCard,
  CompletedCard,
  RejectedCard,
} from "./components/cards";
import CompletionModal from "./components/CompletionModal";
import AddReviewModal from "./components/AddReviewModal/AddReviewModal";
import { ArrowIcon } from "@/app/icons";
import { openChatByOrder } from "@/app/utils/chatApi";
import { loadResponses } from "@/app/expert/responses/store/actions";
import { useResponsesState } from "@/app/expert/responses/store/state";
import { updateResponseStatus } from "@/app/expert/responses/store/api";
import type { ResponseTabKey } from "@/app/expert/responses/store/types";
import type { ResponseCardViewModel } from "@/app/expert/responses/store/types";
import { createReview } from "./store/api";
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
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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

  const handleStatusUpdate = async (responseId: number, newStatus: "REJECTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED") => {
    if (updatingId !== null) {
      return false;
    }

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
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось обновить статус отклика";
      setError(message);
      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const handleOpenReviewModal = (target: ResponseCardViewModel) => {
    setReviewTarget(target);
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (payload: { rating: number; comment: string }) => {
    if (!reviewTarget) {
      return;
    }

    try {
      await createReview({
        response_id: reviewTarget.id,
        rating: payload.rating,
        comment: payload.comment,
      });
      setItems(
        items.map((item) =>
          item.id === reviewTarget.id
            ? { ...item, hasReview: true }
            : item
        )
      );
      setIsReviewModalOpen(false);
      setIsCompletionModalOpen(false);
      showSuccess("Отзыв успешно опубликован");
      await fetchData();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось оставить отзыв";
      showError(message);
    }
  };

  const tabs = [
    { key: "review" as const, label: "Новые", count: counters.review },
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

  const handleOpenChat = async (responseId: number, orderId: number) => {
    setChatOpeningId(responseId);
    try {
      const detail = await openChatByOrder(orderId);
      router.push(`/customer/chat/${detail.uuid}`);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось открыть чат";
      showError(message);
    } finally {
      setChatOpeningId(null);
    }
  };

  const handleInviteToChat = async (responseId: number, orderId: number) => {
    const updated = await handleStatusUpdate(responseId, "ACCEPTED");
    if (updated) {
      await handleOpenChat(responseId, orderId);
    }
  };

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
                      switch (response.rawStatus) {
                        case "REVIEW":
                          return (
                            <ReviewCard
                              dateLabel={response.dateLabel}
                              date={response.date}
                              status="Новый отклик"
                              statusColor={response.statusColor}
                              statusBg={response.statusBg}
                              expertName={response.expertName || ""}
                              expertRating={response.expertRating}
                              expertReviewCount={response.expertReviewCount}
                              onExpertHistory={() => { /* TODO */ }}
                              orderTitle={response.orderTitle}
                              customer={response.customerCompany || response.customer}
                              orderDate={response.orderDate}
                              badges={response.badges}
                              sum={response.orderCustomerSum || response.sum}
                              commentText={response.commentText}
                              expertPrice={response.costEstimate}
                              expertDeadline={response.deadline}
                              techSpecTitle={response.techSpecTitle}
                              techSpecFiles={response.techSpecFiles}
                              onReject={() => void handleStatusUpdate(response.id, "REJECTED")}
                              onAccept={() => void handleInviteToChat(response.id, response.orderId)}
                              isRejectLoading={updatingId === response.id}
                              isAcceptLoading={updatingId === response.id || chatOpeningId === response.id}
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
                              expertName={response.expertName || ""}
                              expertRating={response.expertRating}
                              expertReviewCount={response.expertReviewCount}
                              onExpertHistory={() => { /* TODO */ }}
                              orderTitle={response.orderTitle}
                              customer={response.customerCompany || response.customer}
                              orderDate={response.orderDate}
                              badges={response.badges}
                              sum={response.orderCustomerSum || response.sum}
                              commentText={response.commentText}
                              expertPrice={response.costEstimate}
                              expertDeadline={response.deadline}
                              techSpecTitle={response.techSpecTitle}
                              techSpecFiles={response.techSpecFiles}
                              onReject={() => void handleStatusUpdate(response.id, "REJECTED")}
                              onSelectExpert={() => void handleStatusUpdate(response.id, "IN_PROGRESS")}
                              onChat={() => void handleOpenChat(response.id, response.orderId)}
                              isRejectLoading={updatingId === response.id}
                              isSelectLoading={updatingId === response.id}
                              isChatLoading={chatOpeningId === response.id}
                            />
                          );
                        case "IN_PROGRESS":
                          return (
                            <InProgressCard
                              dateLabel={response.dateLabel}
                              date={response.date}
                              status={`В работе от ${response.date}`}
                              statusColor={response.statusColor}
                              statusBg={response.statusBg}
                              expertName={response.expertName || ""}
                              expertRating={response.expertRating}
                              expertReviewCount={response.expertReviewCount}
                              onExpertHistory={() => { /* TODO */ }}
                              orderTitle={response.orderTitle}
                              customer={response.customerCompany || response.customer}
                              orderDate={response.orderDate}
                              badges={response.badges}
                              sum={response.orderCustomerSum || response.sum}
                              commentText={response.commentText}
                              expertPrice={response.costEstimate}
                              expertDeadline={response.deadline}
                              techSpecTitle={response.techSpecTitle}
                              techSpecFiles={response.techSpecFiles}
                              onReject={() => void handleStatusUpdate(response.id, "REJECTED")}
                              onChat={() => void handleOpenChat(response.id, response.orderId)}
                              onComplete={() => void handleStatusUpdate(response.id, "COMPLETED")}
                              isRejectLoading={updatingId === response.id}
                              isChatLoading={chatOpeningId === response.id}
                              isCompleteLoading={updatingId === response.id}
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
                              expertName={response.expertName || ""}
                              expertRating={response.expertRating}
                              expertReviewCount={response.expertReviewCount}
                              onExpertHistory={() => { /* TODO */ }}
                              orderTitle={response.orderTitle}
                              customer={response.customerCompany || response.customer}
                              orderDate={response.orderDate}
                              badges={response.badges}
                              sum={response.orderCustomerSum || response.sum}
                              commentText={response.commentText}
                              expertPrice={response.costEstimate}
                              expertDeadline={response.deadline}
                              techSpecTitle={response.techSpecTitle}
                              techSpecFiles={response.techSpecFiles}
                              hasReview={response.hasReview}
                              onLeaveReview={() => handleOpenReviewModal(response)}
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
                              expertName={response.expertName || ""}
                              expertRating={response.expertRating}
                              expertReviewCount={response.expertReviewCount}
                              onExpertHistory={() => { /* TODO */ }}
                              orderTitle={response.orderTitle}
                              customer={response.customerCompany || response.customer}
                              orderDate={response.orderDate}
                              badges={response.badges}
                              sum={response.orderCustomerSum || response.sum}
                              commentText={response.commentText}
                              expertPrice={response.costEstimate}
                              expertDeadline={response.deadline}
                              techSpecTitle={response.techSpecTitle}
                              techSpecFiles={response.techSpecFiles}
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
