import type { OrderApplicant } from "./applicant";

/** Документ, прикреплённый к условиям аудита СУПБ. */
export interface AuditOrderDocument {
  name: string;
  url: string;
}

/** Поля аудита, в которых сохраняется ссылка на загруженный документ. */
export type AuditOrderDocumentKey = "sto_file" | "registration_certificate";

/** Общее количество ОПО и количество объектов каждого класса опасности. */
export type AuditObjectCountKey =
  | "opo_total"
  | "opo_class_1"
  | "opo_class_2"
  | "opo_class_3"
  | "opo_class_4";

/** Опасный производственный объект в заявке на аудит. */
export interface AuditOrderObject {
  registration_number: string;
  name: string;
  hazard_class: string;
  address: string;
  industry: string;
  hazard_signs: string;
}

/** Масштаб, объекты и условия заказа на аудит СУПБ. */
export interface AuditOrderDetails extends OrderApplicant {
  audit_scale: "SINGLE_OPO" | "ALL_OPO" | "SELECTED_OPO";
  opo_items: AuditOrderObject[];
  opo_total: number | null;
  opo_class_1: number | null;
  opo_class_2: number | null;
  opo_class_3: number | null;
  opo_class_4: number | null;
  main_industry: string;
  multiple_regions: boolean | null;
  registration_certificate: AuditOrderDocument | null;
  audit_kind: "BASIC" | "INTERIM" | "SELECTIVE" | "CONSULTATION";
  considers_sto: boolean | null;
  sto_name: string;
  sto_file: AuditOrderDocument | null;
  audit_areas: string[];
  desired_timeline:
    | "MONTH_URGENT"
    | "CURRENT_QUARTER"
    | "NEXT_QUARTER"
    | "CONSULTATION";
  comments: string;
}
