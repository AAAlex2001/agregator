import type { Metadata } from "next";
import { getPublicOrderOnServer } from "@/entities/order/server";
import { createOrderMetadata } from "../../../seo/order";
import { OrderPageContent } from "../../../ui/pages/order-page-content";

/** Параметры публичной ссылки на заказ. */
interface OrderPreviewPageProps {
  params: Promise<{ uuid: string }>;
}

/** Загружает актуальные условия заказа для поисковиков и карточек ссылки. */
export async function generateMetadata({
  params,
}: OrderPreviewPageProps): Promise<Metadata> {
  const { uuid } = await params;
  const order = await getPublicOrderOnServer(uuid).catch(() => null);

  return createOrderMetadata(uuid, order);
}

/** Открывает публичный заказ по UUID из адреса страницы. */
export default async function OrderPreviewPage({ params }: OrderPreviewPageProps) {
  const { uuid } = await params;

  return <OrderPageContent uuid={uuid} />;
}
