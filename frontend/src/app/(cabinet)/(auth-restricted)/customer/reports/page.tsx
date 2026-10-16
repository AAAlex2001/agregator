import { redirect } from "next/navigation";
import { CustomerReports } from "@/widgets/orders";
import { readSessionRole } from "../../../../session/read-session-role";

/** Показывает заказчику отчёты по завершённым тендерам, остальных отправляет в настройки. */
export default async function CustomerReportsPage() {
  const role = await readSessionRole();

  if (role && role !== "CUSTOMER") {
    redirect("/settings");
  }

  return <CustomerReports />;
}
