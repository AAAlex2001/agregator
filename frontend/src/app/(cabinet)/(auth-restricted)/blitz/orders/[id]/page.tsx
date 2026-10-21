import { notFound } from "next/navigation";
import { BlitzOrderView } from "@/widgets/blitz";
import { createPrivateMetadata } from "../../../../../seo/private-page";

export const metadata = createPrivateMetadata("Заявка Блиц-эксперта");

/** Номер заявки из адреса и признак возврата со страницы оплаты. */
interface BlitzOrderPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ payment?: string }>;
}

/** Заявка Блиц-эксперта; после оплаты картой сразу проверяется оплата. */
export default async function BlitzOrderPage({ params, searchParams }: BlitzOrderPageProps) {
  const { id } = await params;
  const { payment } = await searchParams;
  const orderId = Number(id);

  if (!Number.isSafeInteger(orderId) || orderId < 1) {
    notFound();
  }

  return (
    <BlitzOrderView
      orderId={orderId}
      afterPayment={payment === "return"}
    />
  );
}
