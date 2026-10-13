import type { DirectionFile } from "../../shared/model/files";

export interface AuditExpertProfile {
  industrial_safety_areas: string[];
  expert_attestation_areas: string[];
  audit_qualifications: string[];
  documents: DirectionFile[];
}

export const emptyAuditExpertProfile: AuditExpertProfile = {
  industrial_safety_areas: [],
  expert_attestation_areas: [],
  audit_qualifications: [],
  documents: [],
};
