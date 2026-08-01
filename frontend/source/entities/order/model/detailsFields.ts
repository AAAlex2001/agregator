import type { OrderWorkType } from "./workTypes";

export type OrderDetailKind = "text" | "textarea" | "list" | "flag";

export interface OrderDetailField {
  key: string;
  label: string;
  kind: OrderDetailKind;
  placeholder?: string;
}

export const EXECUTOR_REQUIREMENT_HINTS = ["Звание", "Должность", "Стаж"] as const;

export const ORDER_DETAILS_TITLES: Partial<Record<OrderWorkType, string>> = {
  CADASTRAL: "Кадастровые работы",
  FORENSIC: "Судебная экспертиза",
  RESEARCH: "Создать заявку на проведение НИР",
  LABORATORY: "Создать заявку на проведение лабораторных исследований",
};

const FIELDS: Partial<Record<OrderWorkType, OrderDetailField[]>> = {
  CADASTRAL: [
    {
      key: "work_location",
      label: "Где необходимо провести работы",
      kind: "text",
      placeholder: "Регион, населённый пункт, кадастровый квартал",
    },
  ],
  FORENSIC: [
    {
      key: "government_body",
      label: "Государственный орган",
      kind: "text",
      placeholder: "Куда требуется предоставить заключение",
    },
    {
      key: "expert_requirements",
      label: "Требования к эксперту",
      kind: "textarea",
      placeholder: "Экспертная специальность, стаж, наличие сертификата",
    },
    {
      key: "subject_location",
      label: "Где находится предмет экспертизы",
      kind: "text",
      placeholder: "Адрес хранения объекта исследования",
    },
  ],
  RESEARCH: [
    {
      key: "executor_requirements",
      label: "Требования к исполнителю",
      kind: "list",
      placeholder: "звание, должность, стаж",
    },
    {
      key: "needs_site_visit",
      label: "Необходимость выезда на объект исследований",
      kind: "flag",
    },
  ],
  LABORATORY: [
    {
      key: "equipment_requirements",
      label: "Требования к оборудованию",
      kind: "textarea",
      placeholder: "Тип оборудования, диапазон измерений, аккредитация",
    },
  ],
};

export function orderDetailsFields(workType: OrderWorkType): OrderDetailField[] {
  return FIELDS[workType] ?? [];
}

export function formatOrderDetailValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Требуется" : "Не требуется";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (value === null || value === undefined) return "";
  return String(value);
}
