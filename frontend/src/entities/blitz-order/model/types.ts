import type { BlitzAuditDetails, BlitzAuditPlan, BlitzTeamMember } from "./audit-types";

/** Путь заявки от подачи до приёмки работы. Консультация, торг и План — только у аудита. */
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

/** Сервис: экспертиза промышленной безопасности или аудит СУПБ. */
export type BlitzService = "expertise" | "audit";

/** Кто заказчик: организация и ИП платят по счёту, физлицо — картой. */
export type BlitzCustomerType = "legal" | "entrepreneur" | "individual";

/** Пожелание заказчика по сроку. */
export type BlitzDeadline = "today" | "three_days" | "week" | "any";

/** Этап оплаты. */
export type BlitzStage = "advance" | "final";

/** Исход экспертизы. */
export type BlitzResult = "positive" | "negative";

/** Документ договора. */
export type BlitzPaper = "contract" | "nda";

/** Чем заказчик подтверждает оплату счёта. */
export type BlitzProofKind = "payment_order" | "guarantee_letter";

/** Что за файл заявки. */
export type BlitzDocumentKind =
  | "documentation"
  | "company_card"
  | "contract"
  | "nda"
  | "remarks"
  | "revision"
  | "conclusion"
  | "payment_order"
  | "guarantee_letter"
  | "audit_item"
  | "opo_certificate"
  | "power_of_attorney"
  | "sto"
  | "audit_plan";

/** Кто сменил статус. */
export type BlitzActor = "customer" | "expert" | "admin" | "system";

/** Какие заявки показать: заказчику свои, эксперту входящие или взятые. */
export type BlitzOrderScope = "my" | "incoming" | "assigned";

/** Реквизиты организации или ИП. */
export interface BlitzCompany {
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
}

/** Паспортные данные физлица. */
export interface BlitzIndividual {
  full_name: string;
  passport_number: string;
  passport_issued_by: string;
  passport_issued_at: string;
  address: string;
}

/** Файл заявки. */
export interface BlitzDocument {
  id: number;
  kind: BlitzDocumentKind;
  name: string;
  size: number;
  remark_id: number | null;
  item_number: number | null;
  created_at: string;
}

/** Раунд замечаний эксперта и ответ заказчика. */
export interface BlitzRemark {
  id: number;
  text: string | null;
  response_text: string | null;
  created_at: string;
  resolved_at: string | null;
  documents: BlitzDocument[];
}

/** Шаг истории статусов. */
export interface BlitzStatusChange {
  status: BlitzStatus;
  actor: BlitzActor;
  note: string | null;
  created_at: string;
}

/** Смена цены администратором. Прежней цены нет, если заказчик аудита её не указывал. */
export interface BlitzPriceChange {
  old_price: number | null;
  new_price: number;
  reason: string;
  created_at: string;
}

/** Счёт на оплату этапа. */
export interface BlitzInvoice {
  id: number;
  number: string;
  stage: BlitzStage;
  amount: number;
  created_at: string;
  reported_at: string | null;
  paid_at: string | null;
  canceled_at: string | null;
}

/** Заявка в списке. */
export interface BlitzOrderSummary {
  id: number;
  service: BlitzService;
  status: BlitzStatus;
  object_name: string;
  object_code: string | null;
  area_code: string | null;
  deadline: BlitzDeadline;
  price: number | null;
  customer_type: BlitzCustomerType;
  expert_name: string | null;
  created_at: string;
  updated_at: string;
}

/** Заявка целиком. */
export interface BlitzOrder extends BlitzOrderSummary {
  hazard_class: number | null;
  expert_category: number | null;
  contract_kind: string | null;
  comment: string | null;
  result: BlitzResult | null;
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
}

/** Вариант выбора из справочника. */
export interface BlitzChoice {
  code: string;
  title: string;
}

/** Область аттестации и её объекты. */
export interface BlitzArea extends BlitzChoice {
  objects: string[];
}

/** Объект экспертизы и подходящие виды договора. */
export interface BlitzObject extends BlitzChoice {
  description: string;
  kinds: string[];
}

/** Справочник для формы и фильтров. */
export interface BlitzCatalog {
  areas: BlitzArea[];
  objects: BlitzObject[];
  kinds: BlitzChoice[];
  deadlines: BlitzChoice[];
}

/** Реквизиты из последней заявки заказчика. */
export interface BlitzRequisites {
  customer_type: BlitzCustomerType | null;
  company: BlitzCompany | null;
  individual: BlitzIndividual | null;
}

/** Ориентир цены по паре «область × объект». */
export interface BlitzTariff {
  area_code: string;
  object_code: string;
  price: number;
}

/** Данные новой заявки без файлов. */
export interface BlitzOrderPayload {
  object_code: string | null;
  area_code: string | null;
  hazard_class: number | null;
  expert_category: number | null;
  deadline: BlitzDeadline;
  object_name: string;
  contract_kind: string | null;
  price: number;
  customer_type: BlitzCustomerType;
  company: BlitzCompany | null;
  individual: BlitzIndividual | null;
  comment: string | null;
}

/** Файлы, которые прикладывает к шагу одна из сторон. */
export interface BlitzUpload {
  text: string;
  files: File[];
}
