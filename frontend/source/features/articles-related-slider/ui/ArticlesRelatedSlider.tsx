"use client";

import { useId } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { ArticleCard, type ArticleListItem } from "@/source/entities/article";
import Button from "@/source/shared/ui/Button";
import SwiperNavigation from "@/source/shared/ui/SwiperNavigation";
import s from "./ArticlesRelatedSlider.module.scss";

interface ArticlesRelatedSliderProps {
  title: string;
  items: ArticleListItem[];
  cta?: {
    href: string;
    label: string;
  };
}

export function ArticlesRelatedSlider({ title, items, cta }: ArticlesRelatedSliderProps) {
  const instanceId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const prevClassName = `articles-related-prev-${instanceId}`;
  const nextClassName = `articles-related-next-${instanceId}`;

  if (items.length === 0) return null;

  return (
    <section className={s.section}>
      <div className={s.header}>
        <h2 className={s.title}>{title}</h2>
        <SwiperNavigation
          prevClassName={prevClassName}
          nextClassName={nextClassName}
          className={s.navigation}
        />
      </div>

      <Swiper
        modules={[Navigation]}
        slidesPerView="auto"
        spaceBetween={20}
        navigation={{
          prevEl: `.${prevClassName}`,
          nextEl: `.${nextClassName}`,
        }}
        className={s.swiper}
      >
        {items.map((item) => (
          <SwiperSlide key={item.id} className={s.slide}>
            <ArticleCard
              kind={item.kind}
              slug={item.slug}
              title={item.title}
              excerpt={item.excerpt}
              cover_image={item.cover_image}
              tags={item.tags}
              published_at={item.published_at}
              likes_count={item.likes_count}
              dislikes_count={item.dislikes_count}
              views_count={item.views_count}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {cta ? (
        <div className={s.ctaRow}>
          <Button href={cta.href} variant="outline" className={s.ctaButton}>
            {cta.label}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
