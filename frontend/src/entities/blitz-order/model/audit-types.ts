import type { BlitzChoice, BlitzCompany, BlitzCustomerType } from "./types";

/** Масштаб аудита: один ОПО, все ОПО организации или выборочные. */
export type BlitzAuditScope = "one" | "all" | "selected";

/** Этап аудита. */
export type BlitzAuditStage = "planning" | "documents" | "onsite" | "report";

/** Тип аудита. */
export type BlitzAuditKind = "basic" | "interim" | "selective" | "consultation";

/** Когда провести аудит. */
export type BlitzAuditTiming = "custom" | "month" | "this_quarter" | "next_quarter" | "studying";

/** Своя сумма или бюджет не установлен. */
export type BlitzAuditBudget = "custom" | "none";

/** Можно ли обсуждать стоимость. */
export type BlitzAuditNegotiation = "yes" | "no" | "on_scope";

/** Ответ заказчика на цену аудитора. */
export type BlitzOfferAnswer = "accept" | "counter" | "decline";

/** Представитель заказчика. */
export interface BlitzAuditApplicant {
  full_name: string;
  position: string;
  organization: string;
  inn: string;
  phone: string;
  email: string;
  by_proxy: boolean;
}

/** Опасный производственный объект. */
export interface BlitzAuditObject {
  reg_number: string;
  name: string;
  hazard_class: string;
  address: string;
  industry: string;
  hazard_signs: string[];
}

/** Все ОПО организации. */
export interface BlitzAuditFleet {
  count: number;
  profile: string;
  multi_region: boolean;
}

/** Тип аудита и уточнения к нему. */
export interface BlitzAuditParams {
  kind: BlitzAuditKind;
  use_sto: boolean | null;
  sto_name: string | null;
  elements: string[];
}

/** Желаемые сроки. */
export interface BlitzAuditTimingValue {
  kind: BlitzAuditTiming;
  start: string | null;
  end: string | null;
}

/** Анкета аудита. */
export interface BlitzAuditDetails {
  applicant: BlitzAuditApplicant;
  scope: BlitzAuditScope;
  objects: BlitzAuditObject[];
  fleet: BlitzAuditFleet | null;
  stages: BlitzAuditStage[];
  params: BlitzAuditParams;
  timing: BlitzAuditTimingValue;
  budget: {
    mode: BlitzAuditBudget;
    negotiation: BlitzAuditNegotiation;
  };
}

/** Что заполняет руководитель группы в Плане аудита. */
export interface BlitzAuditPlanInput {
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
}

/** Отправленный План с номером версии. */
export interface BlitzAuditPlan extends BlitzAuditPlanInput {
  version: number;
}

/** Аудитор: имя, области аттестации и руководитель ли он группы. */
export interface BlitzTeamMember {
  id: number;
  name: string;
  areas: string[];
  lead: boolean;
}

/** Пункт перечня документов. */
export interface BlitzChecklistItem {
  number: number;
  title: string;
}

/** Справочники анкеты аудита и перечень документов. */
export interface BlitzAuditCatalog {
  min_price: number;
  scopes: BlitzChoice[];
  hazard_classes: string[];
  hazard_signs: BlitzChoice[];
  stages: BlitzChoice[];
  kinds: BlitzChoice[];
  elements: BlitzChoice[];
  timings: BlitzChoice[];
  budgets: BlitzChoice[];
  negotiations: BlitzChoice[];
  checklist: BlitzChecklistItem[];
}

/** Данные заявки на аудит без файлов. */
export interface BlitzAuditPayload {
  details: BlitzAuditDetails;
  price: number | null;
  customer_type: BlitzCustomerType;
  company: BlitzCompany;
  comment: string | null;
}

/** Файл, приложенный к пункту перечня. */
export interface BlitzChecklistFile {
  item: number;
  file: File;
}

/** Отдельные файлы заявки на аудит. */
export interface BlitzAuditAttachments {
  companyCard: File | null;
  opoCertificate: File | null;
  powerOfAttorney: File | null;
  stoFile: File | null;
}
