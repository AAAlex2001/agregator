import { redirect } from "next/navigation";
import { readSessionRole } from "../../../../session/read-session-role";
import { CustomerOrdersPageContent } from "../../../../ui/pages/customer-orders-page-content";

/** Показывает заказчику его заказы, остальных ролей отправляет в настройки. */
export default async function CustomerOrdersPage() {
  const role = await readSessionRole();

  if (role && role !== "CUSTOMER") {
    redirect("/settings");
  }

  return <CustomerOrdersPageContent />;
}
