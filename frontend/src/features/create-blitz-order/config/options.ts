import type { BlitzDeadline } from "@/entities/blitz-order";
import type { ExpertRequirement } from "../model/types";

/** Как описать требования к эксперту. */
export const REQUIREMENT_TABS = [
  { id: "unknown", label: "Не знаю" },
  { id: "class", label: "Класс опасности" },
  { id: "category", label: "Категория эксперта" },
];

/** Требования в порядке вкладок. */
export const REQUIREMENTS: ExpertRequirement[] = ["unknown", "class", "category"];

/** Кто заказчик. */
export const CUSTOMER_TYPE_TABS = [
  { id: "legal", label: "Организация" },
  { id: "entrepreneur", label: "ИП" },
  { id: "individual", label: "Физлицо" },
];

/** Желаемый срок. */
export const DEADLINE_TABS = [
  { id: "today", label: "Сегодня" },
  { id: "three_days", label: "До 3 дней" },
  { id: "week", label: "Неделя" },
  { id: "any", label: "Неважно" },
];

/** Сроки в порядке вкладок. */
export const DEADLINES: BlitzDeadline[] = ["today", "three_days", "week", "any"];

/** Вариант «заказчик не знает» в списках справочника. */
export const UNKNOWN_OPTION = { value: "", label: "Не знаю — уточнит эксперт" };

/** Поля паспортных данных физлица, кроме даты выдачи. */
export const INDIVIDUAL_FIELDS = [
  { field: "full_name", label: "ФИО", placeholder: "Иванов Иван Иванович" },
  { field: "passport_number", label: "Серия и номер паспорта", placeholder: "4506 123456" },
  { field: "passport_issued_by", label: "Кем выдан", placeholder: "Как в паспорте" },
  {
    field: "address",
    label: "Адрес регистрации",
    placeholder: "Индекс, город, улица, дом, квартира",
  },
] as const;
