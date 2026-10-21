import { notFound, redirect } from "next/navigation";
import { createPrivateMetadata } from "../../../../../seo/private-page";
import { readSessionRole } from "../../../../../session/read-session-role";
import { ExpertOrderPageContent } from "../../../../../ui/pages/expert-order-page-content";

export const metadata = createPrivateMetadata("Заказ");

/** Номер заказа из адреса. */
interface ExpertOrderPageProps {
  params: Promise<{ id: string }>;
}

/** Заказ и отклик на него для исполнителя; остальных ролей отправляет в настройки. */
export default async function ExpertOrderPage({ params }: ExpertOrderPageProps) {
  const role = await readSessionRole();

  if (role && role !== "EXPERT") {
    redirect("/settings");
  }

  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isSafeInteger(orderId) || orderId < 1) {
    notFound();
  }

  return <ExpertOrderPageContent orderId={orderId} />;
}
