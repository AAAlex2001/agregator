import type { Metadata } from "next";

/** Метаданные публичной страницы со ссылками на реестры заключений ЭПБ. */
export const ZEPB_REGISTRY_METADATA: Metadata = {
  title: "Реестр заключений ЭПБ",
  description:
    "Публичная страница с переходами в официальные реестры заключений экспертизы "
    + "промышленной безопасности.",
  alternates: {
    canonical: "/zepb-registry",
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
