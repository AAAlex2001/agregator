import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CATALOG_PAGE_SIZE } from "@/entities/order";
import { getOrdersOnServer } from "@/entities/order/server";
import { orderListOffset, readOrderListPage } from "../../content/order-list-page";
import { createOrderListMetadata } from "../../seo/order-list";
import { readSessionRole } from "../../session/read-session-role";
import { OrdersPageContent } from "../../ui/pages/orders-page-content";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const dynamic = "force-dynamic";

/** Номер страницы списка из адреса. */
interface PublicOrdersPageProps {
  searchParams: Promise<{ page?: string }>;
}

/** Со второй страницы у списка свой заголовок и канонический адрес. */
export async function generateMetadata({ searchParams }: PublicOrdersPageProps): Promise<Metadata> {
  const { page } = await searchParams;

  return createOrderListMetadata(readOrderListPage(page));
}

/** Заявки для гостя по 10 на страницу; вошедшего пользователя направляет в его раздел. */
export default async function PublicOrdersPage({ searchParams }: PublicOrdersPageProps) {
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

  const page = readOrderListPage((await searchParams).page);
  const initialPage = await getOrdersOnServer({
    skip: orderListOffset(page),
    limit: CATALOG_PAGE_SIZE,
    sort: {
      field: null,
      direction: null,
    },
  });

  return (
    <PublicSiteShell>
      <main>
        <OrdersPageContent
          initialPage={initialPage}
          page={page}
        />
      </main>
    </PublicSiteShell>
  );
}