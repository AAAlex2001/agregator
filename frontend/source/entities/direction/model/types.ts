export type DirectionKey =
  | "EXPERTISE"
  | "AUDIT_SUPB"
  | "CADASTRAL"
  | "FORENSIC"
  | "RESEARCH"
  | "LABORATORY";

export interface DirectionSummary {
  key: DirectionKey;
  title: string;
  profile_filled: boolean;
}

export interface CatalogOption {
  code: string;
  title: string;
}

export interface DirectionCatalogs {
  industrial_safety_areas: CatalogOption[];
  expert_attestation_areas: CatalogOption[];
  audit_qualifications: CatalogOption[];
  accreditation_areas: CatalogOption[];
}

export type DirectionKeyWithProfile = "EXPERTISE" | "AUDIT_SUPB" | "CADASTRAL" | "FORENSIC";
