import type { Metadata } from "next";
import type { ServicePageSeo } from "./types";

/** Собирает прежние метаданные публичной страницы направления. */
export function createServiceMetadata(service: ServicePageSeo): Metadata {
  return {
    title: service.title,
    description: service.description,
    keywords: service.keywords,
    alternates: {
      canonical: service.path,
    },
    openGraph: {
      title: service.title,
      description: service.description,
      type: "website",
      url: service.path,
      siteName: "Ресурс-Плюс",
      locale: "ru_RU",
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.description,
      images: [service.image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
