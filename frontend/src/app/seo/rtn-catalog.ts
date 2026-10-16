import type { Metadata } from "next";
import {
  readRtnFilters,
  readRtnPage,
} from "../content/rtn-catalog-query";
import type { RtnSearchParams } from "../content/rtn-catalog-query";

/** Исходные поисковые метаданные первой страницы каталога РТН. */
const RTN_CATALOG_METADATA: Metadata = {
  title: "Ростехнадзор отвечает: база официальных ответов — Ресурс-Плюс",
  description:
    "Актуальные ответы на сложные вопросы промышленной, энергетической и строительной "
    + "безопасности. Систематизированная база официальных ответов Ростехнадзора.",
  keywords: [
    "ростехнадзор отвечает",
    "разъяснения ростехнадзора",
    "промышленная безопасность вопросы ответы",
    "официальные письма ростехнадзора",
  ],
  alternates: {
    canonical: "/rtn",
  },
  openGraph: {
    title: "Ростехнадзор отвечает: база официальных ответов",
    description:
      "Систематизированная база официальных ответов Ростехнадзора на вопросы "
      + "промышленной безопасности.",
    type: "website",
    url: "/rtn",
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
    title: "Ростехнадзор отвечает: база официальных ответов",
    description: "Систематизированная база официальных ответов Ростехнадзора.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

/** Индексирует обычную пагинацию и сохраняет noindex для поиска и фильтров. */
export function createRtnCatalogMetadata(params: RtnSearchParams): Metadata {
  if (readRtnFilters(params)) {
    return {
      ...RTN_CATALOG_METADATA,
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      },
    };
  }

  const page = readRtnPage(params);

  if (page === 1) {
    return RTN_CATALOG_METADATA;
  }

  return {
    ...RTN_CATALOG_METADATA,
    title: `${RTN_CATALOG_METADATA.title} — страница ${page}`,
    alternates: {
      canonical: `/rtn?page=${page}`,
    },
  };
}
