import type { CatalogOption } from "../../shared/model/catalog";

export interface AuditCatalogs {
  industrial_safety_areas: CatalogOption[];
  expert_attestation_areas: CatalogOption[];
  audit_qualifications: CatalogOption[];
  accreditation_areas: CatalogOption[];
  audit_areas: CatalogOption[];
}

export const emptyAuditCatalogs: AuditCatalogs = {
  industrial_safety_areas: [],
  expert_attestation_areas: [],
  audit_qualifications: [],
  accreditation_areas: [],
  audit_areas: [],
};
