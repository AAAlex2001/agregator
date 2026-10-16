import type { OrderSortField } from "@/entities/order";

/** Подписи сортировки одного свойства заказа. */
interface OrderSortOption {
  field: OrderSortField;
  label: string;
  descendingLabel: string;
  ascendingLabel: string;
}

/** Доступные пользователю способы упорядочить список заказов. */
export const ORDER_SORT_OPTIONS: OrderSortOption[] = [
  {
    field: "created_at",
    label: "Дата публикации",
    descendingLabel: "Сначала новые",
    ascendingLabel: "Сначала старые",
  },
  {
    field: "sum_amount",
    label: "Начальная цена",
    descendingLabel: "Сначала дороже",
    ascendingLabel: "Сначала дешевле",
  },
  {
    field: "responses_deadline",
    label: "Приём откликов",
    descendingLabel: "Позже закрытие",
    ascendingLabel: "Скоро закрытие",
  },
];
