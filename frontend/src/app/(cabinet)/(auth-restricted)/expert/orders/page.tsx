import { redirect } from "next/navigation";
import { readSessionRole } from "../../../../session/read-session-role";
import { ExpertOrdersPageContent } from "../../../../ui/pages/expert-orders-page-content";

/** Заказ, который нужно открыть сразу, из ссылки ?orderId=. */
interface ExpertOrdersPageProps {
  searchParams: Promise<{ orderId?: string | string[] }>;
}

/** Показывает исполнителю доступные заказы, остальных ролей отправляет в настройки. */
export default async function ExpertOrdersPage({ searchParams }: ExpertOrdersPageProps) {
  const role = await readSessionRole();

  if (role && role !== "EXPERT") {
    redirect("/settings");
  }

  const params = await searchParams;
  const openOrderId = Number(params.orderId) || null;

  return <ExpertOrdersPageContent openOrderId={openOrderId} />;
}
