import type { Metadata } from "next";

/** Поисковые метаданные и карточка ссылки публичного каталога контактов. */
export const EXPERT_CONTACTS_METADATA: Metadata = {
  title: "Контакты исполнителей промышленной безопасности",
  description:
    "Каталог аттестованных исполнителей промышленной безопасности с областями аттестации, "
    + "рейтингом и защищенным доступом к контактам.",
  alternates: {
    canonical: "/expert-contacts",
  },
  openGraph: {
    title: "Контакты исполнителей промышленной безопасности",
    description:
      "Аттестованные исполнители с областями аттестации и рейтингом на платформе Ресурс-Плюс.",
    url: "/expert-contacts",
    type: "website",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Ресурс-Плюс",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};
