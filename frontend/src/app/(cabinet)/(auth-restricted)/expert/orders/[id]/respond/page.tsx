import { notFound, redirect } from "next/navigation";
import { createPrivateMetadata } from "../../../../../../seo/private-page";
import { readSessionRole } from "../../../../../../session/read-session-role";
import { RespondPageContent } from "../../../../../../ui/pages/respond-page-content";

export const metadata = createPrivateMetadata("Отклик на заказ");

/** Номер заказа из адреса. */
interface RespondPageProps {
  params: Promise<{ id: string }>;
}

/** Отклик исполнителя на заказ; остальных ролей отправляет в настройки. */
export default async function RespondPage({ params }: RespondPageProps) {
  const role = await readSessionRole();

  if (role && role !== "EXPERT") {
    redirect("/settings");
  }

  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isSafeInteger(orderId) || orderId < 1) {
    notFound();
  }

  return <RespondPageContent orderId={orderId} />;
}
