export type DirectionKey =
  | "EXPERTISE"
  | "AUDIT_SUPB"
  | "CADASTRAL"
  | "FORENSIC"
  | "RESEARCH"
  | "LABORATORY";

/** Направление, доступное текущей роли, и признак заполненности его анкеты. */
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

/** Анкета направления: набор полей зависит от направления и роли, поэтому тип открытый. */
export type DirectionProfile = Record<string, unknown>;
