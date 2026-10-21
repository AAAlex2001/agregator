import { redirect } from "next/navigation";
import { readSessionRole } from "../../../../session/read-session-role";
import { ExpertOrdersPageContent } from "../../../../ui/pages/expert-orders-page-content";

/** Старые ссылки вида ?orderId= на заказ из ленты. */
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
  const orderId = Number(params.orderId);

  if (Number.isSafeInteger(orderId) && orderId > 0) {
    redirect(`/expert/orders/${orderId}`);
  }

  return <ExpertOrdersPageContent />;
}
