import { notFound, redirect } from "next/navigation";
import { ExpertOrder } from "@/widgets/orders";
import { createPrivateMetadata } from "../../../../../seo/private-page";
import { readSessionRole } from "../../../../../session/read-session-role";

export const metadata = createPrivateMetadata("Заказ");

/** Номер заказа из адреса. */
interface ExpertOrderPageProps {
  params: Promise<{ id: string }>;
}

/** Заказ для исполнителя; остальных ролей отправляет в настройки. */
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

  return <ExpertOrder orderId={orderId} />;
}
