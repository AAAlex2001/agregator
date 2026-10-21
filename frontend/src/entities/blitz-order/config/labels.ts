import type { BlitzStatus } from "../model/types";

/** Название статуса экспертизы для заказчика. */
export const BLITZ_STATUS_LABELS = {
  new: "Ждёт эксперта",
  consultation: "Нужна консультация",
  offer: "Предложена цена",
  counter: "Встречная цена",
  expert_ready: "Эксперт готов, подпишите договор",
  contract: "Договор подписан, ждём аванс",
  plan: "Готовится План",
  plan_review: "План на согласовании",
  in_progress: "Эксперт работает",
  remarks: "Замечания эксперта",
  conclusion_ready: "Заключение готово, ждём остаток",
  paid: "Оплачено, эксперт отправляет заключение",
  sent: "Заключение отправлено",
  accepted: "Работа принята",
  canceled: "Заявка отменена",
};

/** Название статуса экспертизы для эксперта: что сейчас ждёт от него или от заказчика. */
export const BLITZ_EXPERT_STATUS_LABELS = {
  new: "Новая заявка",
  consultation: "Консультация",
  offer: "Ждём ответа на цену",
  counter: "Ответьте на цену заказчика",
  expert_ready: "Ждём подписи договора",
  contract: "Ждём аванс",
  plan: "Отправьте План",
  plan_review: "План на согласовании",
  in_progress: "В работе",
  remarks: "Ждём исправлений",
  conclusion_ready: "Ждём оплату остатка",
  paid: "Отправьте заключение",
  sent: "Ждём приёмки",
  accepted: "Работа принята",
  canceled: "Заявка отменена",
};

/** Название статуса аудита для заказчика. */
export const BLITZ_AUDIT_STATUS_LABELS = {
  new: "Ждёт аудитора",
  consultation: "Готовим консультацию",
  offer: "Аудитор предложил цену",
  counter: "Ждём ответа аудитора",
  expert_ready: "Аудитор готов, подпишите договор",
  contract: "Договор подписан, ждём аванс",
  plan: "Готовится План аудита",
  plan_review: "Согласуйте План аудита",
  in_progress: "Идёт аудит",
  remarks: "Замечания аудитора",
  conclusion_ready: "Отчёт готов, ждём остаток",
  paid: "Оплачено, аудитор отправляет отчёт",
  sent: "Отчёт отправлен",
  accepted: "Работа принята",
  canceled: "Заявка отменена",
};

/** Название статуса аудита для аудиторов. */
export const BLITZ_AUDIT_EXPERT_STATUS_LABELS = {
  new: "Новая заявка на аудит",
  consultation: "Консультация",
  offer: "Ждём ответа на цену",
  counter: "Ответьте на цену заказчика",
  expert_ready: "Ждём подписи договора",
  contract: "Ждём аванс",
  plan: "Отправьте План аудита",
  plan_review: "План на согласовании",
  in_progress: "Аудит идёт",
  remarks: "Ждём исправлений",
  conclusion_ready: "Ждём оплату остатка",
  paid: "Отправьте отчёт",
  sent: "Ждём приёмки",
  accepted: "Работа принята",
  canceled: "Заявка отменена",
};

/** Цвет метки статуса: ждём, нужно действие, в работе, готово, отменено. */
export const BLITZ_STATUS_TONES = {
  new: "wait",
  consultation: "wait",
  offer: "action",
  counter: "action",
  expert_ready: "action",
  contract: "action",
  plan: "work",
  plan_review: "action",
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

/** Шаги прогресса аудита: торг — часть шага «Аудитор», План — отдельный шаг. */
export const BLITZ_AUDIT_STEPS: BlitzStatus[] = [
  "new",
  "expert_ready",
  "contract",
  "plan",
  "in_progress",
  "conclusion_ready",
  "paid",
  "sent",
  "accepted",
];

/** Короткие названия шагов прогресса. */
export const BLITZ_STEP_LABELS = {
  new: "Заявка",
  consultation: "Заявка",
  offer: "Цена",
  counter: "Цена",
  expert_ready: "Исполнитель",
  contract: "Договор",
  plan: "План",
  plan_review: "План",
  in_progress: "Работа",
  remarks: "Работа",
  conclusion_ready: "Результат",
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
  expert: "Исполнитель",
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
  audit_item: "Документ по перечню",
  opo_certificate: "Свидетельство о регистрации ОПО",
  power_of_attorney: "Доверенность",
  sto: "СТО организации",
  audit_plan: "План аудита",
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
