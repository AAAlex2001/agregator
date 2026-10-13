"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ArticleCard, type ArticleListItem } from "@/source/entities/article";
import Button from "@/source/shared/ui/Button";
import SwiperNavigation from "@/source/shared/ui/SwiperNavigation";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./articles-preview.module.scss";

interface ArticlesPreviewProps {
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  items: ArticleListItem[];
  navPrefix: string;
}

const ArticlesPreview = ({ title, subtitle, ctaHref, ctaLabel, items, navPrefix }: ArticlesPreviewProps) => {
  if (items.length === 0) return null;

  return (
    <section className={s.section}>
      <div className={s.content}>
        <header className={s.header}>
          <div className={s.headCopy}>
            <Title text={title} />
            <Subtitle text={subtitle} />
          </div>
          <div className={s.arrows}>
            <SwiperNavigation
              prevClassName={`${navPrefix}--prev`}
              nextClassName={`${navPrefix}--next`}
            />
          </div>
        </header>

        <Swiper
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={20}
          navigation={{ prevEl: `.${navPrefix}--prev`, nextEl: `.${navPrefix}--next` }}
          className={s.swiper}
        >
          {items.map((item) => (
            <SwiperSlide key={item.id} className={s.slide}>
              <ArticleCard article={item} />
            </SwiperSlide>
          ))}
        </Swiper>

        <Button href={ctaHref} variant="secondary" className={s.cta}>
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
};

export default ArticlesPreview;
