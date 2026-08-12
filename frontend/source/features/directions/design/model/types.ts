import type { DirectionFile } from "../../shared/model/files";
import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";
import type { LicenseRentalKind } from "@/source/entities/user";

export interface DesignCatalogOption {
  code: string;
  title: string;
}

export interface DesignSpecialtyOption extends DesignCatalogOption {
  short: string;
}

export interface DesignCatalogs {
  specialties: DesignSpecialtyOption[];
  rtn_areas: DesignCatalogOption[];
  doc_categories: DesignCatalogOption[];
  documentation_kinds: DesignCatalogOption[];
  approvals: DesignCatalogOption[];
}

export type DesignDocumentGroup = "education" | "nok" | "nrs" | "qualification" | "rtn";

export interface DesignProfile {
  education: string;
  specialties: string[];
  nok_passed: boolean;
  nrs_number: string;
  sro_gip_declared: boolean;
  qualification_courses: string;
  rtn_areas: string[];
  education_documents: DirectionFile[];
  nok_documents: DirectionFile[];
  nrs_documents: DirectionFile[];
  qualification_documents: DirectionFile[];
  rtn_documents: DirectionFile[];
}

export interface DesignHolderProfile {
  sro_name: string;
  sro_registry_number: string;
  hazardous_objects_right: boolean;
  nuclear_objects_right: boolean;
  liability_level: string;
  pricing_kind: LicenseRentalKind;
  pricing_percent: string;
  pricing_fixed_amount: string;
  documents: DirectionFile[];
}

export type DesignOrderScope = "FULL" | "SECTIONS";

export interface DesignOrderDetails extends ApplicantBlock {
  object_name: string;
  construction_city: string;
  doc_categories: string[];
  documentation_kinds: string[];
  scope: DesignOrderScope;
  sections: string[];
  approvals: string[];
  approvals_other: string;
}

export const emptyDesignCatalogs: DesignCatalogs = {
  specialties: [],
  rtn_areas: [],
  doc_categories: [],
  documentation_kinds: [],
  approvals: [],
};

export const emptyDesignOrderDetails: DesignOrderDetails = {
  ...emptyApplicant,
  object_name: "",
  construction_city: "",
  doc_categories: [],
  documentation_kinds: [],
  scope: "FULL",
  sections: [],
  approvals: [],
  approvals_other: "",
};

export const emptyDesignProfile: DesignProfile = {
  education: "",
  specialties: [],
  nok_passed: false,
  nrs_number: "",
  sro_gip_declared: false,
  qualification_courses: "",
  rtn_areas: [],
  education_documents: [],
  nok_documents: [],
  nrs_documents: [],
  qualification_documents: [],
  rtn_documents: [],
};

export const emptyDesignHolderProfile: DesignHolderProfile = {
  sro_name: "",
  sro_registry_number: "",
  hazardous_objects_right: false,
  nuclear_objects_right: false,
  liability_level: "1",
  pricing_kind: "PERCENT",
  pricing_percent: "",
  pricing_fixed_amount: "",
  documents: [],
};

export const DESIGN_LIABILITY_LEVELS = [
  { value: "1", label: "1 уровень — до 25 млн рублей" },
  { value: "2", label: "2 уровень — до 50 млн рублей" },
  { value: "3", label: "3 уровень — до 300 млн рублей" },
  { value: "4", label: "4 уровень — более 300 млн рублей" },
] as const;
