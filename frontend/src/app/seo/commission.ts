import type { Metadata } from "next";

/** Метаданные страницы конкурсного отбора экспертов. */
export const COMMISSION_METADATA: Metadata = {
  title: "Конкурсная комиссия — примем эксперта промышленной безопасности",
  description:
    "Конкурсный отбор аттестованных экспертов ЭПБ: заявки по вашим областям аттестации, "
    + "договор и оплата через платформу.",
  alternates: {
    canonical: "/konkursnaya-komissiya",
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
