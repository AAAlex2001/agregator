import { redirect } from "next/navigation";
import { ORDERS_PAGE_SIZE } from "@/entities/order";
import { getOrdersOnServer } from "@/entities/order/server";
import { ORDER_LIST_METADATA } from "../../seo/order-list";
import { readSessionRole } from "../../session/read-session-role";
import { OrdersPageContent } from "../../ui/pages/orders-page-content";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const dynamic = "force-dynamic";
export const metadata = ORDER_LIST_METADATA;

/** Загружает заявки для гостя, а вошедшего пользователя направляет в его раздел. */
export default async function PublicOrdersPage() {
  const role = await readSessionRole();

  if (role === "EXPERT") {
    redirect("/expert/orders");
  }

  if (role === "CUSTOMER") {
    redirect("/customer/orders");
  }

  if (role) {
    redirect("/landing");
  }

  const initialPage = await getOrdersOnServer({
    skip: 0,
    limit: ORDERS_PAGE_SIZE,
    sort: {
      field: null,
      direction: null,
    },
  });

  return (
    <PublicSiteShell>
      <main>
        <OrdersPageContent initialPage={initialPage} />
      </main>
    </PublicSiteShell>
  );
}
