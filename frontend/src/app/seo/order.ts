import type { Metadata } from "next";
import type { PublicOrder } from "@/entities/order";

/** Максимальная длина описания публичного заказа в поисковой выдаче. */
const DESCRIPTION_MAX_LENGTH = 220;

/** Убирает переносы строк и лишние пробелы из текста заказа. */
function cleanOrderText(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

/** Собирает прежнее поисковое описание из условий заказа. */
function describeOrder(order: PublicOrder): string {
  const requirements = order.badges
    .map((badge) => cleanOrderText(badge.text))
    .join(", ");
  const parts = [
    cleanOrderText(order.comment),
    order.company ? `Заказчик: ${cleanOrderText(order.company)}.` : "",
    order.sum ? `Начальная цена: ${cleanOrderText(order.sum)}.` : "",
    order.date ? `Срок выполнения: до ${cleanOrderText(order.date)}.` : "",
    order.badges.length > 0 ? `Требования: ${requirements}.` : "",
  ].filter(Boolean);
  const description = parts.join(" ")
    || `Открытая заявка «${cleanOrderText(order.title)}» на платформе Ресурс-Плюс.`;

  if (description.length <= DESCRIPTION_MAX_LENGTH) {
    return description;
  }

  return `${description.slice(0, DESCRIPTION_MAX_LENGTH - 1).trim()}…`;
}

/** Сохраняет canonical и карточки заказа; недоступный заказ закрывает от индексации. */
export function createOrderMetadata(
  publicId: string,
  order: PublicOrder | null,
): Metadata {
  if (!order) {
    return {
      title: "Заявка не найдена",
      robots: {
        index: false,
        follow: false,
      },
      openGraph: {
        images: ["/og-default.png"],
      },
      twitter: {
        images: ["/og-default.png"],
      },
    };
  }

  const title = cleanOrderText(order.title) || `Заявка № ${order.id}`;
  const description = describeOrder(order);
  const path = `/order/${publicId}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
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
      card: "summary",
      title,
      description,
      images: ["/og-default.png"],
    },
  };
}
