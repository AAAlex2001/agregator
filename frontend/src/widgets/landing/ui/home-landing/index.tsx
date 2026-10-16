import type { ReactNode } from "react";
import type { ArticleListItem } from "@/entities/article";
import type { LandingContent } from "@/entities/landing-content";
import { ArticlesPreview } from "../articles-preview";
import { DirectionsSlider } from "../directions-slider";
import { HomeAboutText } from "../home-about-text";
import { HomeHero } from "../home-hero";
import { LandingFaq } from "../landing-faq";
import { LandingReviews } from "../landing-reviews";
import { OrderExamples } from "../order-examples";
import { PlatformAdvantages } from "../platform-advantages";
import { RoleHighlights } from "../role-highlights";
import styles from "./style.module.scss";

/** Контент главной и блоки действий, подключённые на уровне приложения. */
interface HomeLandingProps {
  content: LandingContent;
  news: ArticleListItem[];
  blog: ArticleListItem[];
  heroTitle: string;
  heroDescription: string;
  articleBasePath?: string;
  notifications: ReactNode;
  pricing: ReactNode;
  invitation: ReactNode;
  footer: ReactNode;
}

/** Собирает главную страницу из явных секций с прежним порядком и оформлением. */
export function HomeLanding({
  content,
  news,
  blog,
  heroTitle,
  heroDescription,
  articleBasePath = "",
  notifications,
  pricing,
  invitation,
  footer,
}: HomeLandingProps) {
  const headers = content.section_headers;

  return (
    <div className={styles.page}>
      <main>
        <HomeHero
          title={heroTitle}
          description={heroDescription}
        />
        <DirectionsSlider basePath={articleBasePath} />
        <RoleHighlights />
        <OrderExamples
          orders={content.orders}
          title={headers.orders.title}
          subtitle={headers.orders.subtitle}
        />
        <PlatformAdvantages
          features={content.advantages}
          title={headers.advantages.title || "Почему выбирают Ресурс-Плюс"}
          subtitle={
            headers.advantages.subtitle
            || "Преимущества работы через платформу для заказчиков и исполнителей"
          }
        />
        {notifications}
        <LandingReviews
          reviews={content.reviews}
          title={headers.reviews.title}
          subtitle={headers.reviews.subtitle}
        />
        <ArticlesPreview
          title="Новости отрасли"
          subtitle="Что происходит в горной, нефтегазовой и других отраслях промышленности"
          ctaHref={`${articleBasePath}/news`}
          ctaLabel="Все новости"
          items={news}
          navPrefix="news-nav"
          articleBasePath={articleBasePath}
        />
        <ArticlesPreview
          title="Блог платформы"
          subtitle="Развитие Ресурс-Плюс, кейсы и инструкции по работе с экспертизой"
          ctaHref={`${articleBasePath}/blog`}
          ctaLabel="Все статьи"
          items={blog}
          navPrefix="blog-nav"
          articleBasePath={articleBasePath}
        />
        {pricing}
        <LandingFaq
          items={content.faq}
          title={headers.faq.title}
          subtitle={headers.faq.subtitle}
          decoration
        />
        <HomeAboutText />
      </main>
      {invitation}
      {footer}
    </div>
  );
}
