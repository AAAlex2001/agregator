import type { OrderWorkType } from "./work-types";

export type OrderDetails = Record<string, unknown>;

export interface OrderDetailField {
  key: string;
  label: string;
  kind: "text" | "textarea" | "list" | "flag";
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}

export const MAX_EXECUTOR_REQUIREMENTS = 20;

export const EXECUTOR_REQUIREMENT_HINTS = ["Звание", "Должность", "Стаж"] as const;

const FIELDS: Partial<Record<OrderWorkType, OrderDetailField[]>> = {
  CADASTRAL: [
    {
      key: "work_location",
      label: "Где необходимо провести работы",
      kind: "text",
      placeholder: "Регион, населённый пункт, кадастровый квартал",
      maxLength: 500,
      required: true,
    },
  ],
  FORENSIC: [
    {
      key: "government_body",
      label: "Государственный орган",
      kind: "text",
      placeholder: "Куда требуется предоставить заключение",
      maxLength: 500,
      required: true,
    },
    {
      key: "expert_requirements",
      label: "Требования к эксперту",
      kind: "textarea",
      placeholder: "Экспертная специальность, стаж, наличие сертификата",
      maxLength: 5000,
      required: true,
    },
    {
      key: "subject_location",
      label: "Где находится предмет экспертизы",
      kind: "text",
      placeholder: "Адрес хранения объекта исследования",
      maxLength: 500,
      required: true,
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
      maxLength: 5000,
    },
  ],
};

export function orderDetailsFields(workType: OrderWorkType): OrderDetailField[] {
  return FIELDS[workType] ?? [];
}

export function hasOrderDetails(workType: OrderWorkType): boolean {
  return orderDetailsFields(workType).length > 0;
}

export function emptyOrderDetails(workType: OrderWorkType): OrderDetails {
  return Object.fromEntries(
    orderDetailsFields(workType).map((field) => {
      if (field.kind === "list") return [field.key, [""]];
      if (field.kind === "flag") return [field.key, false];
      return [field.key, ""];
    }),
  );
}

export function validateOrderDetails(workType: OrderWorkType, details: OrderDetails): string | null {
  for (const field of orderDetailsFields(workType)) {
    if (field.kind === "list") {
      if (cleanRequirements(details[field.key]).length > MAX_EXECUTOR_REQUIREMENTS) {
        return `Не более ${MAX_EXECUTOR_REQUIREMENTS} требований к исполнителю`;
      }
      continue;
    }
    if (field.kind === "flag") continue;

    const value = String(details[field.key] ?? "").trim();
    if (field.required && !value) return `Заполните поле «${field.label}»`;
    if (field.maxLength && value.length > field.maxLength) {
      return `«${field.label}» — не более ${field.maxLength} символов`;
    }
  }
  return null;
}

export function cleanRequirements(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter((item) => item.trim() !== "") : [];
}

export function serializeOrderDetails(workType: OrderWorkType, details: OrderDetails): OrderDetails {
  const result: OrderDetails = {};
  for (const field of orderDetailsFields(workType)) {
    result[field.key] =
      field.kind === "list" ? cleanRequirements(details[field.key]) : details[field.key];
  }
  return result;
}

export function normalizeOrderDetails(workType: OrderWorkType, details: OrderDetails): OrderDetails {
  const empty = emptyOrderDetails(workType);
  const expected = Object.keys(empty);
  if (!expected.length) return {};
  if (expected.some((key) => !(key in details))) return empty;
  return Object.fromEntries(expected.map((key) => [key, details[key]]));
}

export function formatOrderDetailValue(value: unknown): string {
  if (typeof value === "boolean") return value ? "Требуется" : "Не требуется";
  if (Array.isArray(value)) return value.filter(Boolean).join(", ");
  if (value === null || value === undefined) return "";
  return String(value);
}
