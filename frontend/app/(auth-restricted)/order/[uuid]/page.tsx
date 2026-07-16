import type { Metadata } from "next";
import { fetchPublicOrder, type PublicOrderPreview } from "@/source/entities/order";
import { OrderPreviewContent } from "@/source/widgets/order-preview";

type Props = { params: Promise<{ uuid: string }> };

function clean(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function truncate(value: string, maxLength = 220): string {
  if (value.length <= maxLength) return value;
  const shortened = value.slice(0, maxLength - 1);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, Math.max(lastSpace, maxLength - 30)).trim()}…`;
}

function buildDescription(order: PublicOrderPreview): string {
  const details = [
    clean(order.comment),
    order.company ? `Заказчик: ${clean(order.company)}.` : "",
    order.sum ? `Начальная цена: ${clean(order.sum)}.` : "",
    order.date ? `Срок выполнения: до ${clean(order.date)}.` : "",
    order.badges.length > 0
      ? `Требования: ${order.badges.map((badge) => clean(badge.text)).filter(Boolean).join(", ")}.`
      : "",
  ].filter(Boolean);

  return truncate(details.join(" ") || `Открытая заявка «${clean(order.title)}» на платформе Ресурс-Плюс.`);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { uuid } = await params;
  const order = await fetchPublicOrder(uuid, { server: true }).catch(() => null);

  if (!order) {
    return {
      title: "Заявка не найдена",
      robots: { index: false, follow: false },
      openGraph: { images: [] },
      twitter: { images: [] },
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
      images: [],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [],
    },
  };
}

export default function OrderPreviewPage() {
  return <OrderPreviewContent />;
}
