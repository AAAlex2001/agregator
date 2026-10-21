import { CATALOG_PAGE_SIZE } from "@/entities/order";

/** Номер страницы списка заказов из адреса: неверный или пустой — первая. */
export function readOrderListPage(value: string | undefined): number {
  return Math.max(1, Math.floor(Number(value)) || 1);
}

/** Сколько заказов пропустить, чтобы показать страницу page. */
export function orderListOffset(page: number): number {
  return (page - 1) * CATALOG_PAGE_SIZE;
}