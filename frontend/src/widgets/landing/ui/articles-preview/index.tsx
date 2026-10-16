"use client";

import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { ArticleCard } from "@/entities/article";
import type { ArticleListItem } from "@/entities/article";
import { Button } from "@/shared/ui/button";
import { Subtitle } from "@/shared/ui/subtitle";
import { SwiperNavigation } from "@/shared/ui/swiper-navigation";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Статьи, заголовок секции и ссылки для публичной страницы или кабинета. */
interface ArticlesPreviewProps {
  title: string;
  subtitle: string;
  ctaHref: string;
  ctaLabel: string;
  items: ArticleListItem[];
  navPrefix: string;
  articleBasePath: string;
}

/** Показывает последние статьи в слайдере; пустая подборка скрывает секцию. */
export function ArticlesPreview({
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  items,
  navPrefix,
  articleBasePath,
}: ArticlesPreviewProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headCopy}>
            <Title text={title} />
            <Subtitle text={subtitle} />
          </div>
          <div className={styles.arrows}>
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
          navigation={{
            prevEl: `.${navPrefix}--prev`,
            nextEl: `.${navPrefix}--next`,
          }}
          className={styles.swiper}
        >
          {items.map((article) => (
            <SwiperSlide
              key={article.id}
              className={styles.slide}
            >
              <ArticleCard
                article={article}
                href={`${articleBasePath}/${article.kind}/${article.slug}`}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <Button
          href={ctaHref}
          variant="secondary"
          className={styles.cta}
        >
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
