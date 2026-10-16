import type { Metadata } from "next";

/** Метаданные публичного блога; canonical не зависит от страницы. */
export const BLOG_LIST_METADATA: Metadata = {
  title: "Блог платформы — обновления и советы по экспертизе ОПО",
  description:
    "Развитие тендерной платформы Ресурс-Плюс: новые функции, кейсы заказчиков "
    + "и исполнителей, инструкции по работе с заказами на экспертизу "
    + "промышленной безопасности.",
  keywords: [
    "блог Ресурс-Плюс",
    "обновления платформы экспертизы",
    "как разместить заказ на экспертизу",
    "как выбрать исполнителя Ростехнадзора",
    "кейсы экспертизы промышленной безопасности",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Блог платформы | Ресурс-Плюс",
    description:
      "Обновления платформы и советы по работе с экспертизой промышленной безопасности.",
    type: "website",
    url: "/blog",
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
    title: "Блог платформы | Ресурс-Плюс",
    description: "Обновления платформы и советы по работе с экспертизой.",
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
