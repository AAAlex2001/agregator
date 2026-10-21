import type { BadgeTone } from "@/shared/ui/badge";

export type BlitzStatus =
  | "new"
  | "expert_ready"
  | "contract"
  | "in_progress"
  | "remarks"
  | "conclusion_ready"
  | "paid"
  | "sent"
  | "accepted"
  | "canceled";

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
  old_price: number;
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

export type BlitzOrder = {
  id: number;
  service: string;
  status: BlitzStatus;
  object_name: string;
  object_code: string | null;
  area_code: string | null;
  deadline: string;
  price: number;
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
  new: "Ждёт эксперта",
  expert_ready: "Ждёт подписи договора",
  contract: "Ждёт аванс",
  in_progress: "Эксперт работает",
  remarks: "Замечания",
  conclusion_ready: "Ждёт остаток",
  paid: "Оплачено, ждём заключение",
  sent: "Заключение отправлено",
  accepted: "Работа принята",
  canceled: "Отменена",
};

export const BLITZ_STATUS_TONES: Record<BlitzStatus, BadgeTone> = {
  new: "neutral",
  expert_ready: "warning",
  contract: "warning",
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
  { label: "Ждут эксперта", statuses: ["new"] },
  {
    label: "В работе",
    statuses: ["expert_ready", "contract", "in_progress", "remarks", "conclusion_ready", "paid", "sent"],
  },
  { label: "Ждут оплату", statuses: ["contract", "conclusion_ready"] },
  { label: "Завершены", statuses: ["accepted"] },
  { label: "Отменены", statuses: ["canceled"] },
];

export const BLITZ_ACTOR_LABELS: Record<BlitzStatusChange["actor"], string> = {
  customer: "Заказчик",
  expert: "Эксперт",
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
};
