import type { RadioOption } from "@/shared/ui/radio-group";

/** Как организация задаёт требование к удостоверению исполнителя. */
export const EXPERTISE_MODE_OPTIONS: RadioOption[] = [
  {
    value: "EXACT",
    label: "Нужно конкретное удостоверение",
    description: "Например, Э1 КЛ/ТП",
  },
  {
    value: "GENERAL",
    label: "Подойдёт любой исполнитель этого вида",
    description: "Например, любой исполнитель КЛ",
  },
];

/** Категории исполнителя; пустое значение не ограничивает категорию. */
export const CATEGORY_OPTIONS: RadioOption[] = [
  {
    value: "",
    label: "Любая категория",
  },
  {
    value: "1",
    label: "1 категория",
  },
  {
    value: "2",
    label: "2 категория",
  },
  {
    value: "3",
    label: "3 категория",
  },
];

/** Срок трудоустройства. */
export const TERM_OPTIONS: RadioOption[] = [
  {
    value: "PERMANENT",
    label: "На постоянной основе",
  },
  {
    value: "FIXED",
    label: "Срочный трудовой договор",
  },
];

/** Вид трудоустройства в объявлении организации. */
export const EMPLOYMENT_TYPE_OPTIONS: RadioOption[] = [
  {
    value: "PRIMARY",
    label: "Основное место работы",
    description: "Для соблюдения лицензионных требований",
  },
  {
    value: "PART_TIME",
    label: "По совместительству",
    description: "Дополнительные исполнители для выполнения работ",
  },
];

/** Текущее основное место работы исполнителя. */
export const JOB_STATUS_OPTIONS: RadioOption[] = [
  {
    value: "NONE",
    label: "Отсутствует",
  },
  {
    value: "EMPLOYED",
    label: "Имеется",
    description: "Для трудоустройства потребуется увольнение",
  },
];
