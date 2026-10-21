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

/** Поля реквизитов организации: подпись и пример заполнения. */
export const COMPANY_FIELDS = [
  {
    field: "full_name",
    label: "Полное наименование",
    placeholder: "Общество с ограниченной ответственностью «…»",
  },
  { field: "name", label: "Краткое наименование", placeholder: "ООО «…»" },
  { field: "inn", label: "ИНН", placeholder: "10 или 12 цифр" },
  { field: "kpp", label: "КПП", placeholder: "У ИП не заполняется" },
  { field: "ogrn", label: "ОГРН или ОГРНИП", placeholder: "13 или 15 цифр" },
  { field: "address", label: "Юридический адрес", placeholder: "Индекс, город, улица, дом" },
  { field: "bank", label: "Банк", placeholder: "ПАО Сбербанк" },
  { field: "bic", label: "БИК", placeholder: "9 цифр" },
  { field: "account", label: "Расчётный счёт", placeholder: "20 цифр" },
  { field: "corr_account", label: "Корреспондентский счёт", placeholder: "20 цифр" },
  { field: "signer_position", label: "Должность подписанта", placeholder: "Генеральный директор" },
  { field: "signer_name", label: "ФИО подписанта", placeholder: "Иванов Иван Иванович" },
  {
    field: "signer_genitive",
    label: "В лице кого",
    placeholder: "генерального директора Иванова Ивана Ивановича",
  },
  { field: "signer_basis", label: "На основании", placeholder: "Устава" },
] as const;

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
