"use client";

import { ReactNode, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowIcon } from "@/shared/ui/icons";
import styles from "./responses-swiper.module.scss";

interface ResponsesSwiperProps<T> {
  items: T[];
  resetKey?: unknown;
  getKey: (item: T) => string | number;
  renderItem: (item: T, isActive: boolean) => ReactNode;
}

export function ResponsesSwiper<T>({ items, resetKey, getKey, renderItem }: ResponsesSwiperProps<T>) {
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setActiveIndex(0);
    setCurrentPage(1);
    swiperRef?.slideTo(0);
  }, [resetKey, swiperRef, items.length]);

  const totalPages = Math.max(1, items.length);

  const paginationItems: (number | "ellipsis")[] = (() => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 3) return [1, 2, 3, "ellipsis", totalPages];
    if (currentPage >= totalPages - 2) return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages];
    return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
  })();

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    swiperRef?.slideTo(page - 1);
  };

  return (
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
        breakpoints={{ 768: { spaceBetween: 20 } }}
        onSwiper={setSwiperRef}
        onSlideChange={(s) => {
          setActiveIndex(s.realIndex);
          setCurrentPage(s.realIndex + 1);
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={getKey(item)} className={styles.slide}>
            <div className={`${styles.slideInner} ${index === activeIndex ? styles.slideActive : ""}`}>
              {renderItem(item, index === activeIndex)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.pagination}>
        <button className={styles.slideBtn} onClick={() => swiperRef?.slidePrev()} aria-label="Назад">
          <ArrowIcon className={styles.arrowLeft} color="#FFDDA9" />
        </button>
        <div className={styles.pages}>
          {paginationItems.map((item, index) =>
            item === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className={styles.pageBtn} aria-hidden="true">...</span>
            ) : (
              <button
                key={item}
                className={`${styles.pageBtn} ${item === currentPage ? styles.pageBtnActive : ""}`}
                onClick={() => handlePageClick(item)}
              >
                {item}
              </button>
            ),
          )}
        </div>
        <button className={styles.slideBtn} onClick={() => swiperRef?.slideNext()} aria-label="Вперед">
          <ArrowIcon color="#FFDDA9" />
        </button>
      </div>
    </div>
  );
}
