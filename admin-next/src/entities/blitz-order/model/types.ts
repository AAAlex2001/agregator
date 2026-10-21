import { formatRub } from "@/shared/lib/money";
import type { BadgeTone } from "@/shared/ui/badge";

export type BlitzStatus =
  | "new"
  | "consultation"
  | "offer"
  | "counter"
  | "expert_ready"
  | "contract"
  | "plan"
  | "plan_review"
  | "in_progress"
  | "remarks"
  | "conclusion_ready"
  | "paid"
  | "sent"
  | "accepted"
  | "canceled";

export type BlitzService = "expertise" | "audit";

export type BlitzCustomerType = "legal" | "entrepreneur" | "individual";

export type BlitzStage = "advance" | "final";

export type BlitzCompany = {
  full_name: string;
  name: string;
  inn: string;
  kpp: string | null;
  ogrn: string;
  address: string;
  bank: string;
  bic: string;
  account: string;
  corr_account: string;
  signer_position: string;
  signer_name: string;
  signer_genitive: string;
  signer_basis: string;
};

export type BlitzIndividual = {
  full_name: string;
  passport_number: string;
  passport_issued_by: string;
  passport_issued_at: string;
  address: string;
};

export type BlitzDocument = {
  id: number;
  kind: string;
  name: string;
  size: number;
  remark_id: number | null;
  item_number: number | null;
  created_at: string;
};

export type BlitzRemark = {
  id: number;
  text: string | null;
  response_text: string | null;
  created_at: string;
  resolved_at: string | null;
  documents: BlitzDocument[];
};

export type BlitzStatusChange = {
  status: BlitzStatus;
  actor: "customer" | "expert" | "admin" | "system";
  note: string | null;
  created_at: string;
};

export type BlitzPriceChange = {
  old_price: number | null;
  new_price: number;
  reason: string;
  created_at: string;
};

export type BlitzInvoice = {
  id: number;
  number: string;
  stage: BlitzStage;
  amount: number;
  created_at: string;
  reported_at: string | null;
  paid_at: string | null;
  canceled_at: string | null;
};

export type BlitzAdminInvoice = BlitzInvoice & {
  order_id: number;
  payer_name: string;
  payer_inn: string;
};

export type BlitzTeamMember = {
  id: number;
  name: string;
  areas: string[];
  lead: boolean;
};

export type BlitzAuditObject = {
  reg_number: string;
  name: string;
  hazard_class: string;
  address: string;
  industry: string;
  hazard_signs: string[];
};

export type BlitzAuditDetails = {
  applicant: {
    full_name: string;
    position: string;
    organization: string;
    inn: string;
    phone: string;
    email: string;
    by_proxy: boolean;
  };
  scope: string;
  objects: BlitzAuditObject[];
  fleet: { count: number; profile: string; multi_region: boolean } | null;
  stages: string[];
  params: { kind: string; use_sto: boolean | null; sto_name: string | null; elements: string[] };
  timing: { kind: string; start: string | null; end: string | null };
  budget: { mode: string; negotiation: string };
};

export type BlitzAuditPlan = {
  version: number;
  documents_start: string;
  documents_end: string;
  onsite_start: string | null;
  onsite_end: string | null;
  meetings: boolean;
  opening_at: string | null;
  closing_at: string | null;
  meeting_link: string | null;
  workshops: string | null;
  interviewees: string;
};

export type BlitzOrder = {
  id: number;
  service: BlitzService;
  status: BlitzStatus;
  object_name: string;
  object_code: string | null;
  area_code: string | null;
  deadline: string;
  price: number | null;
  customer_type: BlitzCustomerType;
  expert_name: string | null;
  created_at: string;
  updated_at: string;
  hazard_class: number | null;
  expert_category: number | null;
  contract_kind: string | null;
  comment: string | null;
  result: "positive" | "negative" | null;
  cancel_reason: string | null;
  customer_name: string;
  paid_amount: number;
  stage: BlitzStage | null;
  amount_due: number | null;
  company: BlitzCompany | null;
  individual: BlitzIndividual | null;
  documents: BlitzDocument[];
  remarks: BlitzRemark[];
  history: BlitzStatusChange[];
  price_changes: BlitzPriceChange[];
  invoices: BlitzInvoice[];
  offer_price: number | null;
  counter_price: number | null;
  audit_details: BlitzAuditDetails | null;
  audit_plan: BlitzAuditPlan | null;
  plan_comment: string | null;
  team: BlitzTeamMember[];
};

export type BlitzOrderList = {
  items: BlitzOrder[];
  total: number;
};

export type BlitzExpertOption = {
  id: number;
  name: string;
  fits: boolean;
};

export type BlitzChoice = {
  code: string;
  title: string;
};

export type BlitzCatalog = {
  areas: (BlitzChoice & { objects: string[] })[];
  objects: (BlitzChoice & { description: string; kinds: string[] })[];
  kinds: BlitzChoice[];
  deadlines: BlitzChoice[];
};

export type BlitzTariff = {
  area_code: string;
  object_code: string;
  price: number;
};

export type BlitzTariffCell = {
  area_code: string;
  object_code: string;
  price: number | null;
};

export const BLITZ_STATUS_LABELS: Record<BlitzStatus, string> = {
  new: "Ждёт исполнителя",
  consultation: "Нужна консультация",
  offer: "Аудитор предложил цену",
  counter: "Встречная цена заказчика",
  expert_ready: "Ждёт подписи договора",
  contract: "Ждёт аванс",
  plan: "Готовится План аудита",
  plan_review: "План на согласовании",
  in_progress: "В работе",
  remarks: "Замечания",
  conclusion_ready: "Ждёт остаток",
  paid: "Оплачено, ждём результат",
  sent: "Результат отправлен",
  accepted: "Работа принята",
  canceled: "Отменена",
};

export const BLITZ_STATUS_TONES: Record<BlitzStatus, BadgeTone> = {
  new: "neutral",
  consultation: "accent",
  offer: "warning",
  counter: "warning",
  expert_ready: "warning",
  contract: "warning",
  plan: "info",
  plan_review: "warning",
  in_progress: "info",
  remarks: "warning",
  conclusion_ready: "warning",
  paid: "info",
  sent: "accent",
  accepted: "success",
  canceled: "danger",
};

export const BLITZ_STATUSES = Object.keys(BLITZ_STATUS_LABELS) as BlitzStatus[];

export const BLITZ_STATUS_GROUPS: { label: string; statuses: BlitzStatus[] }[] = [
  { label: "Все", statuses: [] },
  { label: "Ждут исполнителя", statuses: ["new"] },
  { label: "Консультация", statuses: ["consultation"] },
  { label: "Торг", statuses: ["offer", "counter"] },
  {
    label: "В работе",
    statuses: [
      "expert_ready",
      "contract",
      "plan",
      "plan_review",
      "in_progress",
      "remarks",
      "conclusion_ready",
      "paid",
      "sent",
    ],
  },
  { label: "Ждут оплату", statuses: ["contract", "conclusion_ready"] },
  { label: "Завершены", statuses: ["accepted"] },
  { label: "Отменены", statuses: ["canceled"] },
];

export const BLITZ_ACTOR_LABELS: Record<BlitzStatusChange["actor"], string> = {
  customer: "Заказчик",
  expert: "Исполнитель",
  admin: "Администратор",
  system: "Автоматически",
};

export const BLITZ_CUSTOMER_TYPE_LABELS: Record<BlitzCustomerType, string> = {
  legal: "Организация",
  entrepreneur: "ИП",
  individual: "Физлицо",
};

export const BLITZ_STAGE_LABELS: Record<BlitzStage, string> = {
  advance: "Аванс 50 %",
  final: "Остаток",
};

export const BLITZ_DOCUMENT_LABELS: Record<string, string> = {
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
  opo_certificate: "Свидетельство ОПО",
  power_of_attorney: "Доверенность",
  sto: "СТО организации",
  audit_plan: "План аудита",
};

export const BLITZ_SERVICE_LABELS: Record<BlitzService, string> = {
  expertise: "Экспертиза",
  audit: "Аудит СУПБ",
};

/** Цена заявки: заказчик аудита может её не указывать. */
export const blitzPriceLabel = (price: number | null) => (price === null ? "Не указана" : formatRub(price));

export const AUDIT_KIND_LABELS: Record<string, string> = {
  basic: "Базовый (полный)",
  interim: "Промежуточный",
  selective: "Выборочный",
  consultation: "Нужна консультация",
};

export const AUDIT_STAGE_LABELS: Record<string, string> = {
  planning: "Планирование",
  documents: "Документарный",
  onsite: "Выездной",
  report: "Итоговый отчёт",
};

export const AUDIT_TIMING_LABELS: Record<string, string> = {
  custom: "Свой срок",
  month: "В течение месяца",
  this_quarter: "В текущем квартале",
  next_quarter: "В следующем квартале",
  studying: "Изучают предложение",
};

export const AUDIT_NEGOTIATION_LABELS: Record<string, string> = {
  yes: "можно обсуждать",
  no: "бюджет фиксирован",
  on_scope: "обсуждаемо при изменении объёма или сроков",
};