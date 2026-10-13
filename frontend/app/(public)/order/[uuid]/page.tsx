import type { Metadata } from "next";
import { fetchPublicOrder, type PublicOrderPreview } from "@/source/entities/order";
import { OrderPreview } from "@/source/features/orders/preview";

interface OrderPreviewPageProps {
  params: Promise<{ uuid: string }>;
}

const DESCRIPTION_MAX_LENGTH = 220;

function clean(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function buildDescription(order: PublicOrderPreview): string {
  const parts = [
    clean(order.comment),
    order.company ? `Заказчик: ${clean(order.company)}.` : "",
    order.sum ? `Начальная цена: ${clean(order.sum)}.` : "",
    order.date ? `Срок выполнения: до ${clean(order.date)}.` : "",
    order.badges.length > 0 ? `Требования: ${order.badges.map((badge) => clean(badge.text)).join(", ")}.` : "",
  ].filter(Boolean);
  const text = parts.join(" ") || `Открытая заявка «${clean(order.title)}» на платформе Ресурс-Плюс.`;
  return text.length <= DESCRIPTION_MAX_LENGTH ? text : `${text.slice(0, DESCRIPTION_MAX_LENGTH - 1).trim()}…`;
}

export async function generateMetadata({ params }: OrderPreviewPageProps): Promise<Metadata> {
  const { uuid } = await params;
  const order = await fetchPublicOrder(uuid, { server: true }).catch(() => null);
  if (!order) {
    return {
      title: "Заявка не найдена",
      robots: { index: false, follow: false },
      openGraph: { images: ["/og-default.png"] },
      twitter: { images: ["/og-default.png"] },
    };
  }

  const title = clean(order.title) || `Заявка № ${order.id}`;
  const description = buildDescription(order);
  return {
    title,
    description,
    alternates: { canonical: `/order/${uuid}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/order/${uuid}`,
      images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Ресурс-Плюс" }],
    },
    twitter: { card: "summary", title, description, images: ["/og-default.png"] },
  };
}

export default async function OrderPreviewPage({ params }: OrderPreviewPageProps) {
  const { uuid } = await params;
  return <OrderPreview uuid={uuid} />;
}
