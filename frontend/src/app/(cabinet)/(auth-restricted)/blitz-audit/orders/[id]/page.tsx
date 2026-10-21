import { notFound } from "next/navigation";
import { BlitzOrderView } from "@/widgets/blitz";
import { createPrivateMetadata } from "../../../../../seo/private-page";

export const metadata = createPrivateMetadata("Заявка на аудит СУПБ");

/** Номер заявки из адреса. */
interface BlitzAuditOrderPageProps {
  params: Promise<{ id: string }>;
}

/** Заявка на аудит СУПБ: аудит оплачивается по счёту, возврата со страницы оплаты нет. */
export default async function BlitzAuditOrderPage({ params }: BlitzAuditOrderPageProps) {
  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isSafeInteger(orderId) || orderId < 1) {
    notFound();
  }

  return (
    <BlitzOrderView
      orderId={orderId}
      service="audit"
      afterPayment={false}
    />
  );
}