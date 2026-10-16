import type { Metadata } from "next";

/** Общие тексты первого экрана и метаданных главной страницы. */
export const HOME_PAGE_SEO = {
  title: "Первая единая площадка для специалистов и промышленников России",
  description:
    "Экспертиза промышленной безопасности, аудит СУПБ, техническое освидетельствование "
    + "и диагностирование, НИР и лабораторные исследования, кадастровые работы, "
    + "судебная экспертиза, проектирование, инженерные изыскания, строительный контроль "
    + "и экологическое сопровождение предприятий. Разместите заказ бесплатно — "
    + "проверенные исполнители откликнутся с ценой и сроками.",
  keywords: [
    "Ресурс-Плюс",
    "площадка для специалистов и промышленников",
    "промышленные и инженерные услуги",
    "экспертиза промышленной безопасности",
    "аудит СУПБ",
    "техническое освидетельствование",
    "техническое диагностирование",
    "НИР",
    "лабораторные исследования",
    "кадастровые работы",
    "судебная экспертиза",
    "проектирование",
    "инженерные изыскания",
    "строительный контроль",
    "экологическое сопровождение",
  ],
};

/** Метаданные публичной главной страницы с прежними canonical и карточками ссылки. */
export const HOME_PAGE_METADATA: Metadata = {
  title: HOME_PAGE_SEO.title,
  description: HOME_PAGE_SEO.description,
  keywords: HOME_PAGE_SEO.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: HOME_PAGE_SEO.title,
    description: HOME_PAGE_SEO.description,
    type: "website",
    url: "/",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Ресурс-Плюс",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_PAGE_SEO.title,
    description: HOME_PAGE_SEO.description,
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};
