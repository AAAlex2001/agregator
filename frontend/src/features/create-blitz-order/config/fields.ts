import { blitzCompanyPlaces } from "@/entities/blitz-order";
import type { FieldPlace } from "@/shared/lib/step-error";
import { INDIVIDUAL_FIELDS } from "./options";
import type { OrderStep } from "./steps";

/** Где поля заявки на экспертизу: по ним ошибка сервера ведёт на нужный шаг. */
export const ORDER_FIELD_PLACES: FieldPlace<OrderStep>[] = [
  { path: "object_name", step: "subject", label: "Наименование документации" },
  { path: "object_code", step: "subject", label: "Объект экспертизы" },
  { path: "area_code", step: "subject", label: "Область аттестации" },
  { path: "hazard_class", step: "subject", label: "Класс опасности" },
  { path: "expert_category", step: "subject", label: "Категория эксперта" },
  { path: "contract_kind", step: "subject", label: "Вид договора" },
  { path: "deadline", step: "subject", label: "Срок" },
  { path: "price", step: "price", label: "Цена" },
  { path: "files", step: "documents", label: "Документация" },
  { path: "customer_type", step: "customer", label: "Тип заказчика" },
  ...blitzCompanyPlaces<OrderStep>("customer"),
  { path: "company_card", step: "customer", label: "Карточка организации" },
  { path: "individual", step: "customer", label: "Паспортные данные" },
  ...INDIVIDUAL_FIELDS.map((item) => ({
    path: `individual.${item.field}`,
    step: "customer" as const,
    label: item.label,
  })),
  { path: "individual.passport_issued_at", step: "customer", label: "Дата выдачи" },
  { path: "comment", step: "comment", label: "Комментарий" },
];