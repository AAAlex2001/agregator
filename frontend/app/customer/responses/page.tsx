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
import { ResponsesState, ResponsesTabs } from "@/app/components/Responses";
import CustomerResponseCard from "./components/CustomerResponseCard";
import CompletionModal from "./components/CompletionModal";
import { ArrowIcon } from "@/app/icons";
import { loadResponses } from "@/app/expert/responses/store/actions";
import { useResponsesState } from "@/app/expert/responses/store/state";
import { updateResponseStatus } from "@/app/expert/responses/store/api";
import type { ResponseTabKey } from "@/app/expert/responses/store/types";
import styles from "@/app/expert/responses/responses.module.scss";

const TAB_META: Array<{ key: ResponseTabKey; label: string }> = [
  { key: "new", label: "Новые" },
  { key: "review", label: "На рассмотрении" },
  { key: "rejected", label: "Отклоненные" },
  { key: "accepted", label: "Принятые" },
  { key: "completed", label: "Завершены" },
  { key: "archive", label: "Архив" },
];

export default function CustomerResponsesPage() {
  const router = useRouter();
  const { items, counters, isLoading, error, setLoading, setError, setItems, setCounters } = useResponsesState();
  const [activeTab, setActiveTab] = useState<ResponseTabKey>("new");
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);

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
      return;
    }

    setUpdatingId(responseId);
    setError(null);

    try {
      await updateResponseStatus(responseId, newStatus);
      if (newStatus === "COMPLETED") {
        setIsCompletionModalOpen(true);
      }
      await fetchData();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось обновить статус отклика";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs = [
    { key: "new" as const, label: "Новые", count: counters.new },
    { key: "review" as const, label: "На рассмотрении", count: counters.review },
    { key: "rejected" as const, label: "Отклоненные", count: counters.rejected },
    { key: "accepted" as const, label: "Принятые", count: counters.accepted },
    { key: "completed" as const, label: "Завершены", count: counters.completed },
    { key: "archive" as const, label: "Архив", count: counters.archive },
  ];

  const totalPages = Math.max(1, items.length);
  const activeTabLabel = TAB_META.find((tab) => tab.key === activeTab)?.label ?? "Новые";

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
                      const isReview = response.rawStatus === "NEW" || response.rawStatus === "REVIEW";
                      const isInProgress = response.rawStatus === "IN_PROGRESS";
                      const isAccepted = response.rawStatus === "ACCEPTED";
                      const isCompleted = response.rawStatus === "COMPLETED";

                      return (
                    <CustomerResponseCard
                      dateLabel={response.dateLabel}
                      date={response.date}
                      status={isReview ? "Новый отклик" : response.status}
                      statusColor={isCompleted ? "#137333" : response.statusColor}
                      statusBg={isCompleted ? "#E6F4EA" : response.statusBg}
                      expertName={response.expertName || ""}
                      expertRating={response.expertRating}
                      expertReviewCount={response.expertReviewCount}
                      onExpertHistory={() => { /* TODO: navigate to expert history */ }}
                      orderTitle={response.orderTitle}
                      customer={response.customerCompany || response.customer}
                      orderDate={response.orderDate}
                      badges={response.badges}
                      sum={response.orderCustomerSum || response.sum}
                      techSpecTitle={response.techSpecTitle}
                      techSpecFiles={response.techSpecFiles}
                      showActions={isReview || isInProgress || isAccepted || isCompleted}
                      showRejectAction={!isAccepted && !isCompleted}
                      acceptBtnText={isCompleted ? "Оставить отзыв" : isAccepted ? "Завершить проект" : isInProgress ? "Выбрать исполнителем" : "Пригласить в чат"}
                      rejectBtnVariant="transparent"
                      acceptBtnVariant={isCompleted ? "secondary" : isAccepted ? "green" : isInProgress ? "outline" : "secondary"}
                      onChat={(isInProgress || isAccepted) ? () => {
                        router.push(`/customer/chat?orderId=${response.orderId}`);
                      } : undefined}
                      chatBtnText="Перейти в чат"
                      onReject={() => void handleStatusUpdate(response.id, "REJECTED")}
                      onAccept={() => {
                        if (isCompleted) {
                          setIsCompletionModalOpen(true);
                          return;
                        }
                        void handleStatusUpdate(
                          response.id,
                          isAccepted ? "COMPLETED" : isInProgress ? "ACCEPTED" : "IN_PROGRESS"
                        );
                      }}
                      isRejectLoading={updatingId === response.id}
                      isAcceptLoading={updatingId === response.id}
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

      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => setIsCompletionModalOpen(false)}
      />
    </>
  );
}
