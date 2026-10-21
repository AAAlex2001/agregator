import { blitzCompanyPlaces } from "@/entities/blitz-order";
import type { FieldPlace } from "@/shared/lib/step-error";
import { APPLICANT_FIELDS } from "./options";
import type { AuditStep } from "./steps";

/** Где поля заявки на аудит: по ним ошибка сервера ведёт на нужный шаг. */
export const AUDIT_FIELD_PLACES: FieldPlace<AuditStep>[] = [
  { path: "details.applicant", step: "applicant", label: "Заявитель" },
  ...APPLICANT_FIELDS.map((item) => ({
    path: `details.applicant.${item.field}`,
    step: "applicant" as const,
    label: item.label,
  })),
  { path: "details.applicant.phone", step: "applicant", label: "Телефон" },
  { path: "details.applicant.email", step: "applicant", label: "Корпоративная почта" },
  { path: "details", step: "objects", label: "Объекты аудита" },
  { path: "details.scope", step: "objects", label: "Масштаб аудита" },
  { path: "details.objects", step: "objects", label: "Сведения об ОПО" },
  { path: "details.fleet", step: "objects", label: "Сведения об ОПО организации" },
  { path: "details.stages", step: "params", label: "Этапы" },
  { path: "details.params", step: "params", label: "Параметры аудита" },
  { path: "details.params.kind", step: "params", label: "Тип аудита" },
  { path: "details.params.sto_name", step: "params", label: "Наименование СТО" },
  { path: "details.params.elements", step: "params", label: "Направления аудита" },
  { path: "details.timing", step: "terms", label: "Сроки" },
  { path: "details.budget", step: "terms", label: "Бюджет" },
  { path: "price", step: "terms", label: "Цена" },
  { path: "files", step: "documents", label: "Документы по перечню" },
  { path: "items", step: "documents", label: "Пункты перечня" },
  { path: "opo_certificate", step: "documents", label: "Свидетельство ОПО" },
  { path: "power_of_attorney", step: "documents", label: "Доверенность" },
  { path: "sto_file", step: "documents", label: "Файл СТО" },
  { path: "customer_type", step: "customer", label: "Тип заказчика" },
  ...blitzCompanyPlaces<AuditStep>("customer"),
  { path: "company_card", step: "customer", label: "Карточка организации" },
  { path: "comment", step: "comment", label: "Комментарий" },
];