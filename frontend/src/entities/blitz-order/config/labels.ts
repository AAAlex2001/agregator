import type { BlitzStatus } from "../model/types";

/** Название статуса для заказчика. */
export const BLITZ_STATUS_LABELS = {
  new: "Ждёт эксперта",
  expert_ready: "Эксперт готов, подпишите договор",
  contract: "Договор подписан, ждём аванс",
  in_progress: "Эксперт работает",
  remarks: "Замечания эксперта",
  conclusion_ready: "Заключение готово, ждём остаток",
  paid: "Оплачено, эксперт отправляет заключение",
  sent: "Заключение отправлено",
  accepted: "Работа принята",
  canceled: "Заявка отменена",
};

/** Название статуса для эксперта: что сейчас ждёт от него или от заказчика. */
export const BLITZ_EXPERT_STATUS_LABELS = {
  new: "Новая заявка",
  expert_ready: "Ждём подписи договора",
  contract: "Ждём аванс",
  in_progress: "В работе",
  remarks: "Ждём исправлений",
  conclusion_ready: "Ждём оплату остатка",
  paid: "Отправьте заключение",
  sent: "Ждём приёмки",
  accepted: "Работа принята",
  canceled: "Заявка отменена",
};

/** Цвет метки статуса: ждём, нужно действие, в работе, готово, отменено. */
export const BLITZ_STATUS_TONES = {
  new: "wait",
  expert_ready: "action",
  contract: "action",
  in_progress: "work",
  remarks: "action",
  conclusion_ready: "action",
  paid: "work",
  sent: "action",
  accepted: "done",
  canceled: "canceled",
};

/** Шаги прогресса заявки по порядку. Замечания — часть работы эксперта. */
export const BLITZ_STEPS: BlitzStatus[] = [
  "new",
  "expert_ready",
  "contract",
  "in_progress",
  "conclusion_ready",
  "paid",
  "sent",
  "accepted",
];

/** Короткие названия шагов прогресса. */
export const BLITZ_STEP_LABELS = {
  new: "Заявка",
  expert_ready: "Эксперт",
  contract: "Договор",
  in_progress: "Работа",
  remarks: "Работа",
  conclusion_ready: "Заключение",
  paid: "Оплата",
  sent: "Отправлено",
  accepted: "Принято",
  canceled: "Отменена",
};

/** Кто заказчик. */
export const BLITZ_CUSTOMER_TYPE_LABELS = {
  legal: "Организация",
  entrepreneur: "ИП",
  individual: "Физическое лицо",
};

/** Этапы оплаты. */
export const BLITZ_STAGE_LABELS = {
  advance: "Аванс 50 %",
  final: "Остаток",
};

/** Исход экспертизы. */
export const BLITZ_RESULT_LABELS = {
  positive: "Положительное",
  negative: "Отрицательное",
};

/** Кто сменил статус. */
export const BLITZ_ACTOR_LABELS = {
  customer: "Заказчик",
  expert: "Эксперт",
  admin: "Администратор",
  system: "Автоматически",
};

/** Что за файл. */
export const BLITZ_DOCUMENT_LABELS = {
  documentation: "Документация",
  company_card: "Карточка организации",
  contract: "Договор",
  nda: "Соглашение о конфиденциальности",
  remarks: "Замечания эксперта",
  revision: "Исправленная документация",
  conclusion: "Заключение",
  payment_order: "Платёжное поручение",
  guarantee_letter: "Гарантийное письмо",
};

/** Классы опасности ОПО. */
export const BLITZ_HAZARD_CLASSES = [
  { value: "1", label: "I класс" },
  { value: "2", label: "II класс" },
  { value: "3", label: "III класс" },
  { value: "4", label: "IV класс" },
];

/** Категории эксперта. */
export const BLITZ_CATEGORIES = [
  { value: "1", label: "1 категория" },
  { value: "2", label: "2 категория" },
  { value: "3", label: "3 категория" },
];

/** Желаемый срок. */
export const BLITZ_DEADLINE_LABELS = {
  today: "Сегодня",
  three_days: "До 3 дней",
  week: "Неделя",
  any: "Неважно",
};
