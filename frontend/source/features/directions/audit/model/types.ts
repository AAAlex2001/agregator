import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";
import type { DirectionFile } from "../../shared/model/files";

export type AuditParticipantKind = "AUDITOR" | "INSPECTION_BODY";
export type AuditScale = "SINGLE_OPO" | "ALL_OPO" | "SELECTED_OPO";
export type AuditKind = "BASIC" | "INTERIM" | "SELECTIVE" | "CONSULTATION";
export type AuditTimeline = "MONTH_URGENT" | "CURRENT_QUARTER" | "NEXT_QUARTER" | "CONSULTATION";

export interface AuditCustomerProfile {
  position: string;
  opo_license_number: string;
}

export interface AuditExpertProfile {
  participant_kind: AuditParticipantKind;
  industrial_safety_areas: string[];
  expert_attestation_areas: string[];
  audit_qualifications: string[];
  full_name: string;
  short_name: string;
  inn: string;
  certificate_number: string;
  accreditation_areas: string[];
  documents: DirectionFile[];
}

export interface CatalogOption {
  code: string;
  title: string;
}

export interface AuditCatalogs {
  industrial_safety_areas: CatalogOption[];
  expert_attestation_areas: CatalogOption[];
  audit_qualifications: CatalogOption[];
  accreditation_areas: CatalogOption[];
  audit_areas: CatalogOption[];
}

export interface AuditOpoItem {
  registration_number: string;
  name: string;
  hazard_class: string;
  address: string;
  industry: string;
  hazard_signs: string;
}

export interface AuditOrderDetails extends ApplicantBlock {
  audit_scale: AuditScale;
  opo_items: AuditOpoItem[];
  opo_total: number | null;
  opo_class_1: number | null;
  opo_class_2: number | null;
  opo_class_3: number | null;
  opo_class_4: number | null;
  main_industry: string;
  multiple_regions: boolean | null;
  registration_certificate: DirectionFile | null;
  audit_kind: AuditKind;
  considers_sto: boolean | null;
  sto_name: string;
  sto_file: DirectionFile | null;
  audit_areas: string[];
  desired_timeline: AuditTimeline;
  comments: string;
}

export const emptyAuditCustomerProfile: AuditCustomerProfile = {
  position: "",
  opo_license_number: "",
};

export const emptyAuditExpertProfile: AuditExpertProfile = {
  participant_kind: "AUDITOR",
  industrial_safety_areas: [],
  expert_attestation_areas: [],
  audit_qualifications: [],
  full_name: "",
  short_name: "",
  inn: "",
  certificate_number: "",
  accreditation_areas: [],
  documents: [],
};

export const emptyAuditCatalogs: AuditCatalogs = {
  industrial_safety_areas: [],
  expert_attestation_areas: [],
  audit_qualifications: [],
  accreditation_areas: [],
  audit_areas: [],
};

export const emptyAuditOpoItem: AuditOpoItem = {
  registration_number: "",
  name: "",
  hazard_class: "",
  address: "",
  industry: "",
  hazard_signs: "",
};

export const emptyAuditOrderDetails: AuditOrderDetails = {
  ...emptyApplicant,
  audit_scale: "SINGLE_OPO",
  opo_items: [{ ...emptyAuditOpoItem }],
  opo_total: null,
  opo_class_1: null,
  opo_class_2: null,
  opo_class_3: null,
  opo_class_4: null,
  main_industry: "",
  multiple_regions: null,
  registration_certificate: null,
  audit_kind: "BASIC",
  considers_sto: null,
  sto_name: "",
  sto_file: null,
  audit_areas: [],
  desired_timeline: "CURRENT_QUARTER",
  comments: "",
};
