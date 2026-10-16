import type { ResponseSortField } from "@/entities/response";

/** Подписи сортировки откликов по одному полю. */
interface ResponseSortOption {
  field: ResponseSortField;
  label: string;
  descendingLabel: string;
  ascendingLabel: string;
}

/** Доступные заказчику способы упорядочить отклики. */
export const RESPONSE_SORT_OPTIONS: ResponseSortOption[] = [
  {
    field: "created_at",
    label: "По дате",
    descendingLabel: "Сначала новые ↑",
    ascendingLabel: "Сначала старые ↓",
  },
  {
    field: "proposed_sum_amount",
    label: "По цене",
    descendingLabel: "Сначала дороже ↑",
    ascendingLabel: "Сначала дешевле ↓",
  },
  {
    field: "expert_rating",
    label: "По рейтингу",
    descendingLabel: "Сначала выше ↑",
    ascendingLabel: "Сначала ниже ↓",
  },
];
