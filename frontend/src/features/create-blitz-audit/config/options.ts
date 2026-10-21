import type {
  BlitzAuditBudget,
  BlitzAuditKind,
  BlitzAuditNegotiation,
  BlitzAuditScope,
  BlitzAuditStage,
  BlitzAuditTiming,
} from "@/entities/blitz-order";
import type { AuditCustomerType } from "../model/types";

/** Масштабы аудита по порядку. */
export const AUDIT_SCOPES: BlitzAuditScope[] = ["one", "all", "selected"];

/** Этапы аудита по порядку. */
export const AUDIT_STAGES: BlitzAuditStage[] = ["planning", "documents", "onsite", "report"];

/** Типы аудита по порядку. */
export const AUDIT_KINDS: BlitzAuditKind[] = ["basic", "interim", "selective", "consultation"];

/** Сроки по порядку. */
export const AUDIT_TIMINGS: BlitzAuditTiming[] = [
  "custom",
  "month",
  "this_quarter",
  "next_quarter",
  "studying",
];

/** Готовность обсуждать цену по порядку. */
export const AUDIT_NEGOTIATIONS: BlitzAuditNegotiation[] = ["yes", "no", "on_scope"];

/** Своя сумма или бюджет не установлен. */
export const BUDGET_TABS = [
  { id: "custom", label: "Своя сумма" },
  { id: "none", label: "Не установлен" },
];

/** Варианты бюджета в порядке вкладок. */
export const AUDIT_BUDGETS: BlitzAuditBudget[] = ["custom", "none"];

/** Кто заказчик аудита. */
export const CUSTOMER_TYPE_TABS = [
  { id: "legal", label: "Организация" },
  { id: "entrepreneur", label: "ИП" },
];

/** Типы заказчика в порядке вкладок. */
export const AUDIT_CUSTOMER_TYPES: AuditCustomerType[] = ["legal", "entrepreneur"];

/** Поля представителя заказчика. */
export const APPLICANT_FIELDS = [
  { field: "full_name", label: "ФИО представителя", placeholder: "Иванов Иван Иванович" },
  { field: "position", label: "Должность", placeholder: "Главный инженер" },
  { field: "organization", label: "Организация", placeholder: "ООО «…»" },
  { field: "inn", label: "ИНН организации", placeholder: "10 или 12 цифр" },
] as const;

/** Текстовые поля ОПО. */
export const OBJECT_FIELDS = [
  { field: "reg_number", label: "Регистрационный номер ОПО", placeholder: "А01-00001-0001" },
  { field: "name", label: "Наименование ОПО", placeholder: "Площадка котельной" },
  { field: "address", label: "Адрес ОПО", placeholder: "Регион, город, улица, дом" },
  { field: "industry", label: "Отрасль и вид деятельности", placeholder: "Теплоснабжение" },
] as const;