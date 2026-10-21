import type { FieldPlace } from "@/shared/lib/step-error";
import type { RespondStep } from "./steps";

/** Где поля отклика: по ним ошибка сервера ведёт на нужный шаг. */
export const RESPOND_FIELD_PLACES: FieldPlace<RespondStep>[] = [
  { path: "proposed_start_date", step: "terms", label: "Срок начала выполнения работ" },
  { path: "proposed_deadline", step: "terms", label: "Срок окончания выполнения работ" },
  { path: "proposed_sum_amount", step: "terms", label: "Стоимость работ" },
  { path: "vat_kind", step: "terms", label: "НДС" },
  { path: "expert_inn", step: "company", label: "ИНН организации" },
  { path: "expert_company_data", step: "company", label: "Организация" },
  { path: "comment", step: "comment", label: "Комментарий для заказчика" },
  { path: "files", step: "comment", label: "Файлы" },
];