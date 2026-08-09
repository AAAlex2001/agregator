import type { OrderWorkType } from "./workTypes";

export type OrderDetailKind = "text" | "flag" | "list" | "file" | "opo_list";

export interface OrderDetailField {
  key: string;
  label: string;
  kind: OrderDetailKind;
  group?: string;
  wide?: boolean;
  valueLabels?: Record<string, string>;
}

export const EXECUTOR_REQUIREMENT_HINTS = ["Звание", "Должность", "Стаж"] as const;

export const ORDER_DETAILS_TITLES: Partial<Record<OrderWorkType, string>> = {
  CADASTRAL: "Кадастровые работы",
  FORENSIC: "Судебная экспертиза",
  RESEARCH: "Проведение НИР",
  LABORATORY: "Лабораторные исследования",
  AUDIT_SUPB: "Аудит СУПБ",
  TECH_DIAG: "Техническое освидетельствование и диагностирование",
};

const APPLICANT_GROUP = "Заявитель";

const APPLICANT_FIELDS: OrderDetailField[] = [
  { key: "applicant_full_name", label: "ФИО представителя", kind: "text", group: APPLICANT_GROUP },
  { key: "applicant_position", label: "Должность", kind: "text", group: APPLICANT_GROUP },
  { key: "applicant_organization", label: "Организация", kind: "text", group: APPLICANT_GROUP },
  { key: "applicant_inn", label: "ИНН", kind: "text", group: APPLICANT_GROUP },
  { key: "applicant_phone", label: "Телефон", kind: "text", group: APPLICANT_GROUP },
  { key: "applicant_email", label: "Email", kind: "text", group: APPLICANT_GROUP },
];

const FIELDS: Partial<Record<OrderWorkType, OrderDetailField[]>> = {
  CADASTRAL: [
    ...APPLICANT_FIELDS,
    { key: "work_purpose", label: "Цель работ", kind: "text", group: "Работы", wide: true },
    { key: "city", label: "Где находится объект", kind: "text", group: "Работы" },
    { key: "duration", label: "Срок проведения работ", kind: "text", group: "Работы" },
    {
      key: "education_requirement",
      label: "Требования к образованию",
      kind: "text",
      group: "Требования к исполнителю",
      wide: true,
    },
    {
      key: "sro_required",
      label: "Обязательное членство в СРО",
      kind: "flag",
      group: "Требования к исполнителю",
    },
  ],
  FORENSIC: [
    ...APPLICANT_FIELDS,
    { key: "expertise_purpose", label: "Цель экспертизы", kind: "text", group: "Экспертиза", wide: true },
    { key: "government_body", label: "Государственный орган", kind: "text", group: "Экспертиза" },
    { key: "city", label: "Где находится предмет экспертизы", kind: "text", group: "Экспертиза" },
    { key: "duration", label: "Срок проведения экспертизы", kind: "text", group: "Экспертиза" },
    {
      key: "education_requirement",
      label: "Требования к образованию",
      kind: "text",
      group: "Требования к эксперту",
      wide: true,
    },
    {
      key: "extra_requirements",
      label: "Дополнительные требования",
      kind: "text",
      group: "Требования к эксперту",
      wide: true,
    },
    {
      key: "similar_experience_required",
      label: "Обязателен опыт аналогичных экспертиз",
      kind: "flag",
      group: "Требования к эксперту",
    },
  ],
  RESEARCH: [
    ...APPLICANT_FIELDS,
    {
      key: "executor_requirements",
      label: "Требования к исполнителю",
      kind: "list",
      group: "Работы",
      wide: true,
    },
    {
      key: "needs_site_visit",
      label: "Необходимость выезда на объект исследований",
      kind: "flag",
      group: "Работы",
    },
  ],
  LABORATORY: [
    ...APPLICANT_FIELDS,
    {
      key: "equipment_requirements",
      label: "Требования к оборудованию",
      kind: "text",
      group: "Работы",
      wide: true,
    },
  ],
  TECH_DIAG: [
    ...APPLICANT_FIELDS,
    { key: "purpose", label: "Цель проведения работ", kind: "text", group: "Работы", wide: true },
    { key: "object_city", label: "Где находится объект", kind: "text", group: "Работы" },
    { key: "duration", label: "Срок проведения", kind: "text", group: "Работы" },
  ],
  AUDIT_SUPB: [
    ...APPLICANT_FIELDS,
    {
      key: "audit_scale",
      label: "Что нужно аудировать",
      kind: "text",
      group: "Объект аудита",
      valueLabels: {
        SINGLE_OPO: "Один ОПО",
        ALL_OPO: "Все ОПО организации",
        SELECTED_OPO: "Выборочные ОПО",
      },
    },
    { key: "opo_total", label: "Общее количество ОПО", kind: "text", group: "Объект аудита" },
    { key: "opo_class_1", label: "ОПО I класса", kind: "text", group: "Объект аудита" },
    { key: "opo_class_2", label: "ОПО II класса", kind: "text", group: "Объект аудита" },
    { key: "opo_class_3", label: "ОПО III класса", kind: "text", group: "Объект аудита" },
    { key: "opo_class_4", label: "ОПО IV класса", kind: "text", group: "Объект аудита" },
    { key: "main_industry", label: "Основной отраслевой профиль", kind: "text", group: "Объект аудита" },
    { key: "multiple_regions", label: "ОПО в разных субъектах РФ", kind: "flag", group: "Объект аудита" },
    { key: "opo_items", label: "Объекты", kind: "opo_list", group: "Объект аудита", wide: true },
    {
      key: "registration_certificate",
      label: "Свидетельство о регистрации ОПО",
      kind: "file",
      group: "Объект аудита",
    },
    {
      key: "audit_kind",
      label: "Тип аудита",
      kind: "text",
      group: "Параметры аудита",
      valueLabels: {
        BASIC: "Базовый",
        INTERIM: "Промежуточный",
        SELECTIVE: "Выборочный",
        CONSULTATION: "Консультация",
      },
    },
    { key: "considers_sto", label: "Учитывать СТО организации", kind: "flag", group: "Параметры аудита" },
    { key: "sto_name", label: "СТО", kind: "text", group: "Параметры аудита" },
    { key: "sto_file", label: "Файл СТО", kind: "file", group: "Параметры аудита" },
    {
      key: "audit_areas",
      label: "Направления аудита (п.17 Приказа 318)",
      kind: "list",
      group: "Параметры аудита",
      wide: true,
    },
    {
      key: "desired_timeline",
      label: "Желаемые сроки",
      kind: "text",
      group: "Сроки и комментарии",
      valueLabels: {
        MONTH_URGENT: "В течение месяца (срочно)",
        CURRENT_QUARTER: "Текущий квартал",
        NEXT_QUARTER: "Следующий квартал",
        CONSULTATION: "Консультация",
      },
    },
    { key: "comments", label: "Комментарии", kind: "text", group: "Сроки и комментарии", wide: true },
  ],
};

export function orderDetailsFields(workType: OrderWorkType): OrderDetailField[] {
  return FIELDS[workType] ?? [];
}

function isOrderFile(value: unknown): value is { name: string } {
  return (
    typeof value === "object" && value !== null && "name" in value && typeof value.name === "string"
  );
}

function formatOpoItem(value: unknown): string {
  if (typeof value !== "object" || value === null) return "";
  const registration =
    "registration_number" in value && typeof value.registration_number === "string"
      ? value.registration_number
      : "";
  const name = "name" in value && typeof value.name === "string" ? value.name : "";
  return [registration, name].filter(Boolean).join(" — ");
}

export function formatOrderDetailValue(field: OrderDetailField, value: unknown): string {
  if (value === null || value === undefined) return "";
  if (field.kind === "flag") {
    return typeof value === "boolean" ? (value ? "Да" : "Нет") : "";
  }
  if (field.kind === "list") {
    return Array.isArray(value) ? value.filter(Boolean).join(", ") : "";
  }
  if (field.kind === "file") {
    return isOrderFile(value) ? value.name : "";
  }
  if (field.kind === "opo_list") {
    return Array.isArray(value) ? value.map(formatOpoItem).filter(Boolean).join("\n") : "";
  }
  const text = String(value);
  return field.valueLabels?.[text] ?? text;
}
