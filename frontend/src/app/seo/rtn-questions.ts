import type { Metadata } from "next";

/** Метаданные индексируемой страницы отправки обращения в Ростехнадзор. */
export const RTN_QUESTIONS_METADATA: Metadata = {
  title: "Задать вопрос в Ростехнадзор",
  description:
    "Передайте вопрос по промышленной, энергетической или строительной безопасности "
    + "для подготовки официального обращения в Ростехнадзор.",
  keywords: [
    "задать вопрос ростехнадзору",
    "обращение в ростехнадзор",
    "вопрос по промышленной безопасности",
    "официальный ответ ростехнадзора",
  ],
  alternates: {
    canonical: "/rtn/ask",
  },
  openGraph: {
    title: "Задать вопрос в Ростехнадзор",
    description:
      "Официальные обращения по вопросам промышленной и энергетической безопасности.",
    url: "/rtn/ask",
    type: "website",
    images: [
      {
        url: "/rtn-question-hero.webp",
        width: 1600,
        height: 600,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};
