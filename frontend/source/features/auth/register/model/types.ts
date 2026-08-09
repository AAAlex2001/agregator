export type { RegisterResponse, UserRole } from "@/source/entities/user";
export type { RegisterPayload } from "./api";

import type { SelectedLocation } from "@/source/shared/ui/YandexMap";
import type { ExpertiseType } from "@/source/entities/expertise";
import type { LicenseRentalKind, UserRole } from "@/source/entities/user";
import type { PartySuggestion } from "@/source/features/party-suggest";
import type { ExpertiseProfile } from "@/source/features/directions/expertise";
import type {
  AuditCustomerProfile,
  AuditExpertProfile,
  AuditLicenseHolderProfile,
} from "@/source/features/directions/audit";
import type { CadastralProfile } from "@/source/features/directions/cadastral";
import type { ForensicProfile } from "@/source/features/directions/forensic";
import type { ResearchProfile } from "@/source/features/directions/research";
import type { LaboratoryProfile } from "@/source/features/directions/laboratory";
import type { DirectionFilesState } from "./directionFiles";

export type StringField =
  | "email"
  | "password"
  | "confirm"
  | "phone"
  | "firstName"
  | "lastName"
  | "licenseNumber"
  | "rentalPercent"
  | "rentalFixed"
  | "miningNumber"
  | "labNumber"
  | "contactPrice"
  | "contactDetails";

export type FileKey = "license" | "mining" | "sro" | "lab";
export type ConsentKey = "privacy" | "terms" | "personal";
export type DocFileKey = "cadastralDiploma" | "cadastralCertificate" | "forensicDiploma";
export type DocListKey = "auditDocuments" | "cadastralDocuments" | "forensicDocuments";

export interface RegisterState {
  waiting: boolean;
  error: string | null;
  role: UserRole;
  email: string;
  password: string;
  confirm: string;
  phone: string;
  firstName: string;
  lastName: string;
  location: SelectedLocation | null;
  travels: boolean;
  showOnMap: boolean;
  mapFields: string[];
  contactEnabled: boolean;
  contactPrice: string;
  contactDetails: string;
  contactConsent: boolean;
  party: PartySuggestion | null;
  companyName: string;
  expertiseProfile: ExpertiseProfile | null;
  auditExpertProfile: AuditExpertProfile | null;
  auditCustomerProfile: AuditCustomerProfile | null;
  auditHolderProfile: AuditLicenseHolderProfile | null;
  cadastralProfile: CadastralProfile | null;
  forensicProfile: ForensicProfile | null;
  researchProfile: ResearchProfile | null;
  laboratoryProfile: LaboratoryProfile | null;
  directionFiles: DirectionFilesState;
  licenseEnabled: boolean;
  licenseNumber: string;
  licenseAreas: ExpertiseType[];
  rentalKind: LicenseRentalKind;
  rentalPercent: string;
  rentalFixed: string;
  miningNumber: string;
  labNumber: string;
  files: Record<FileKey, File | null>;
  consents: Record<ConsentKey, boolean>;
}

export type RegisterAction =
  | { type: "SUBMIT_PENDING" }
  | { type: "SUBMIT_FULFILLED" }
  | { type: "SUBMIT_REJECTED"; payload: string }
  | { type: "set"; key: StringField; value: string }
  | { type: "role"; value: UserRole }
  | { type: "travels"; value: boolean }
  | { type: "showOnMap"; value: boolean }
  | { type: "mapFields"; value: string[] }
  | { type: "contactEnabled"; value: boolean }
  | { type: "contactConsent"; value: boolean }
  | { type: "location"; point: SelectedLocation }
  | { type: "party"; party: PartySuggestion }
  | { type: "companyText"; value: string }
  | { type: "expertise"; value: ExpertiseProfile | null }
  | { type: "auditExpert"; value: AuditExpertProfile | null }
  | { type: "auditCustomer"; value: AuditCustomerProfile | null }
  | { type: "auditHolder"; value: AuditLicenseHolderProfile | null }
  | { type: "cadastral"; value: CadastralProfile | null }
  | { type: "forensic"; value: ForensicProfile | null }
  | { type: "research"; value: ResearchProfile | null }
  | { type: "laboratory"; value: LaboratoryProfile | null }
  | { type: "licenseEnabled"; value: boolean }
  | { type: "areas"; value: ExpertiseType[] }
  | { type: "rentalKind"; value: LicenseRentalKind }
  | { type: "file"; key: FileKey; file: File | null }
  | { type: "docFile"; key: DocFileKey; file: File | null }
  | { type: "docAdd"; key: DocListKey; files: File[] }
  | { type: "docRemove"; key: DocListKey; index: number }
  | { type: "consent"; key: ConsentKey; value: boolean };
