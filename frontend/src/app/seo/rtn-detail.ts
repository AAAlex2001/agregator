import type { Metadata } from "next";
import type { RtnDetail } from "@/entities/rtn";
import { createPrivateMetadata } from "./private-page";

/** Индексирует опубликованное разъяснение и исключает отсутствующий материал. */
export function createRtnDetailMetadata(clarification: RtnDetail | null): Metadata {
  if (!clarification) {
    return createPrivateMetadata("Разъяснение не найдено");
  }

  const title = clarification.meta_title || clarification.title;
  const description = clarification.meta_description
    || clarification.excerpt
    || clarification.title;
  const canonical = `/rtn/${clarification.slug}`;

  return {
    title,
    description,
    keywords: clarification.meta_keywords || clarification.tags.join(", "),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonical,
      images: [
        {
          url: "/og-default.png",
          width: 1200,
          height: 630,
          alt: clarification.title,
        },
      ],
      publishedTime: clarification.published_at || undefined,
      modifiedTime: clarification.updated_at,
      tags: clarification.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
}

/** Сохраняет заголовок разъяснения в кабинете и исключает его дубль из индексации. */
export function createPrivateRtnDetailMetadata(
  clarification: RtnDetail | null,
): Metadata {
  return createPrivateMetadata(
    clarification?.meta_title || clarification?.title || "Ростехнадзор отвечает",
  );
}
