import type { FieldPlace } from "@/shared/lib/step-error";
import type { EditResponseStep } from "./steps";

/** Где поля изменения отклика: по ним ошибка сервера ведёт на нужный шаг. */
export const EDIT_RESPONSE_FIELD_PLACES: FieldPlace<EditResponseStep>[] = [
  { path: "proposed_start_date", step: "terms", label: "Срок начала выполнения работ" },
  { path: "proposed_deadline", step: "terms", label: "Срок окончания выполнения работ" },
  { path: "proposed_sum_amount", step: "terms", label: "Стоимость работ" },
  { path: "vat_kind", step: "terms", label: "НДС" },
  { path: "comment", step: "comment", label: "Комментарий для заказчика" },
  { path: "files", step: "comment", label: "Файлы" },
  { path: "keep_files", step: "comment", label: "Файлы" },
];