import type { ExpertCertificate } from "@/source/entities/expertise";

export interface DirectionDocument {
  name: string;
  url: string;
}

export interface ExpertiseExpertProfile {
  certificates: ExpertCertificate[];
}

export interface AuditCustomerProfile {
  position: string;
  opo_license_number: string;
}

export type AuditParticipantKind = "AUDITOR" | "INSPECTION_BODY";

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
  documents: DirectionDocument[];
}

export interface CadastralExpertProfile {
  education: string;
  registry_joined_at: string | null;
  certificate_number: string | null;
  registry_number: string | null;
  equipment: string;
  workplace: string;
  documents: DirectionDocument[];
}

export type ForensicWorkplaceKind = "INDIVIDUAL" | "ORGANIZATION";

export interface ForensicExpertProfile {
  education: string;
  similar_cases_experience: string;
  workplace_kind: ForensicWorkplaceKind;
  workplace_name: string;
  documents: DirectionDocument[];
}

export type DirectionProfile =
  | ExpertiseExpertProfile
  | AuditCustomerProfile
  | AuditExpertProfile
  | CadastralExpertProfile
  | ForensicExpertProfile;
