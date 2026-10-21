import { CATALOG_PAGE_SIZE } from "@/entities/order";
import { getArchivedOrdersOnServer } from "@/entities/order/server";
import { ArchiveOrders } from "@/widgets/orders";
import { orderListOffset, readOrderListPage } from "../../../content/order-list-page";

/** Номер страницы архива из адреса. */
interface ArchivePageProps {
  searchParams: Promise<{ page?: string }>;
}

/** Завершённые заказы площадки по 10 на страницу; первая порция приходит с сервера. */
export default async function ArchivePage({ searchParams }: ArchivePageProps) {
  const page = readOrderListPage((await searchParams).page);
  const initialPage = await getArchivedOrdersOnServer(orderListOffset(page), CATALOG_PAGE_SIZE);

  return (
    <ArchiveOrders
      initialPage={initialPage ?? undefined}
      page={page}
    />
  );
}