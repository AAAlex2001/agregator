import { redirect } from "next/navigation";
import { readSessionRole } from "../../../../../session/read-session-role";
import { CreateOrderPageContent } from "../../../../../ui/pages/create-order-page-content";

/** Открывает создание заказа только заказчику, остальных ролей отправляет в настройки. */
export default async function CreateOrderPage() {
  const role = await readSessionRole();

  if (role && role !== "CUSTOMER") {
    redirect("/settings");
  }

  return <CreateOrderPageContent />;
}
