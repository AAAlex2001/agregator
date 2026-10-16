import type { Metadata } from "next";
import { SITE_URL } from "@/shared/config/site";
import { HOME_PAGE_SEO } from "./home";

/** Общие метаданные сайта; страницы дополняют их собственным заголовком и описанием. */
export const SITE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${HOME_PAGE_SEO.title} | Ресурс-Плюс`,
    template: "%s | Ресурс-Плюс",
  },
  description: HOME_PAGE_SEO.description,
  keywords: HOME_PAGE_SEO.keywords,
  applicationName: "Ресурс-Плюс",
  authors: [{ name: "Ресурс-Плюс" }],
  category: "industrial and engineering services",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  openGraph: {
    type: "website",
    siteName: "Ресурс-Плюс",
    locale: "ru_RU",
    title: HOME_PAGE_SEO.title,
    description: HOME_PAGE_SEO.description,
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
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
