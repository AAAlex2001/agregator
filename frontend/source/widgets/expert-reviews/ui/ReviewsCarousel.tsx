"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { ArrowIcon } from "@/source/shared/ui/icons";
import s from "./ReviewsCarousel.module.scss";

interface Props<T> {
  items: T[];
  getKey: (item: T) => number | string;
  renderItem: (item: T, isActive: boolean) => ReactNode;
}

export function ReviewsCarousel<T>({ items, getKey, renderItem }: Props<T>) {
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setActiveIndex(0);
    setCurrentPage(1);
    swiperRef?.slideTo(0);
  }, [items.length, swiperRef]);

  const totalPages = Math.max(1, items.length);

  const paginationItems: Array<number | "ellipsis"> = (() => {
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

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    swiperRef?.slideTo(page - 1);
  };

  return (
    <div className={s.cardsSection}>
      <div className={s.shadeLeft} />
      <div className={s.shadeRight} />

      <Swiper
        className={s.swiper}
        modules={[Navigation]}
        slidesPerView="auto"
        spaceBetween={16}
        centeredSlides
        loop={false}
        breakpoints={{ 768: { spaceBetween: 20 } }}
        onSwiper={setSwiperRef}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
          setCurrentPage(swiper.realIndex + 1);
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={getKey(item)} className={s.slide}>
            <div className={`${s.slideInner} ${index === activeIndex ? s.slideActive : ""}`}>
              {renderItem(item, index === activeIndex)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={s.pagination}>
        <button className={s.slideBtn} onClick={() => swiperRef?.slidePrev()} aria-label="Назад">
          <ArrowIcon className={s.arrowLeft} color="#FFDDA9" />
        </button>

        <div className={s.pages}>
          {paginationItems.map((item, index) => (
            item === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className={s.pageBtn} aria-hidden="true">
                ...
              </span>
            ) : (
              <button
                key={item}
                className={`${s.pageBtn} ${item === currentPage ? s.pageBtnActive : ""}`}
                onClick={() => handlePageClick(item)}
              >
                {item}
              </button>
            )
          ))}
        </div>

        <button className={s.slideBtn} onClick={() => swiperRef?.slideNext()} aria-label="Вперед">
          <ArrowIcon color="#FFDDA9" />
        </button>
      </div>
    </div>
  );
}