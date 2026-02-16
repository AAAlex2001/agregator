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
import { ResponsesState, ResponsesTabs } from "./components";
import { loadResponses } from "./store/actions";
import { updateResponseStatus } from "./store/api";
import { useResponsesState } from "./store/state";
import type { ResponseTabKey } from "./store/types";
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
  const [startedResponses, setStartedResponses] = useState<Record<number, boolean>>({});
  const [loadingActionByResponseId, setLoadingActionByResponseId] = useState<Record<number, "withdraw" | "complete" | null>>({});

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem("expert_started_responses");
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as number[];
      const next: Record<number, boolean> = {};
      for (const id of parsed) {
        if (Number.isInteger(id) && id > 0) {
          next[id] = true;
        }
      }
      setStartedResponses(next);
    } catch {
      setStartedResponses({});
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const ids = Object.entries(startedResponses)
      .filter(([, started]) => started)
      .map(([id]) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0);

    window.localStorage.setItem("expert_started_responses", JSON.stringify(ids));
  }, [startedResponses]);

  const setActionLoading = (responseId: number, mode: "withdraw" | "complete" | null) => {
    setLoadingActionByResponseId((previous) => ({
      ...previous,
      [responseId]: mode,
    }));
  };

  const handleWithdrawResponse = async (responseId: number) => {
    setActionLoading(responseId, "withdraw");
    try {
      await updateResponseStatus(responseId, "REJECTED");
      await fetchData();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось отозвать отклик";
      setError(message);
    } finally {
      setActionLoading(responseId, null);
    }
  };

  const handleStartOrComplete = async (responseId: number) => {
    if (!startedResponses[responseId]) {
      setStartedResponses((previous) => ({
        ...previous,
        [responseId]: true,
      }));
      return;
    }

    setActionLoading(responseId, "complete");
    try {
      await updateResponseStatus(responseId, "COMPLETED");
      setStartedResponses((previous) => {
        const next = { ...previous };
        delete next[responseId];
        return next;
      });
      await fetchData();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Не удалось завершить проект";
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
                      const isAcceptedExpertCard = isExpert && response.rawStatus === "ACCEPTED";
                      const isCompletedCard = response.rawStatus === "COMPLETED";
                      const isStarted = Boolean(startedResponses[response.id]);
                      const actionLoading = loadingActionByResponseId[response.id] ?? null;
                      const cardStatus = isAcceptedExpertCard && isStarted ? "В работе" : response.status;
                      const cardStatusColor = isAcceptedExpertCard && isStarted ? "#1565C0" : response.statusColor;
                      const cardStatusBg = isAcceptedExpertCard && isStarted ? "#E3F2FD" : response.statusBg;

                      return (
                    <ResponseCard
                      dateLabel={response.dateLabel}
                      date={response.date}
                      status={cardStatus}
                      statusColor={cardStatusColor}
                      statusBg={cardStatusBg}
                      orderTitle={response.orderTitle}
                      customer={response.customer}
                      orderDate={response.orderDate}
                      badges={response.badges}
                      sum={response.sum}
                      deadline={response.deadline}
                      costEstimate={response.costEstimate}
                      commissionText={response.commissionText}
                      commissionAmount={response.commissionAmount}
                      commentTitle={response.commentTitle}
                      commentText={response.commentText}
                      techSpecTitle={response.techSpecTitle}
                      techSpecFiles={response.techSpecFiles}
                      editBtnText={isAcceptedExpertCard ? "Отклонить отклик" : undefined}
                      payBtnText={isAcceptedExpertCard ? (isStarted ? "Завершить проект" : "Начать работу") : undefined}
                      editBtnVariant={isAcceptedExpertCard ? "outline" : undefined}
                      payBtnVariant={isAcceptedExpertCard ? "green" : undefined}
                      showActions={!isCompletedCard && isAcceptedExpertCard}
                      onEdit={isAcceptedExpertCard ? () => void handleWithdrawResponse(response.id) : undefined}
                      onPay={isAcceptedExpertCard ? () => void handleStartOrComplete(response.id) : undefined}
                      isEditLoading={isAcceptedExpertCard && actionLoading === "withdraw"}
                      isPayLoading={isAcceptedExpertCard && actionLoading === "complete"}
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
    </>
  );
}
