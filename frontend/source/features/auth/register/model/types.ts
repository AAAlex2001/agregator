import type {
  AuditCustomerProfile,
  AuditExpertProfile,
  AuditLicenseHolderProfile,
} from "@/source/entities/directions/audit";
import type { CadastralProfile } from "@/source/entities/directions/cadastral";
import type { DesignProfile } from "@/source/entities/directions/design";
import type { SroHolderProfile } from "@/source/entities/directions/shared";
import type { EcologyProfile } from "@/source/entities/directions/ecology";
import type { ExpertiseProfile } from "@/source/entities/directions/expertise";
import type { ForensicProfile } from "@/source/entities/directions/forensic";
import type { LaboratoryProfile } from "@/source/entities/directions/laboratory";
import type { ResearchProfile } from "@/source/entities/directions/research";
import type { SurveyProfile } from "@/source/entities/directions/survey";
import type { TechDiagHolderProfile, TechDiagProfile } from "@/source/entities/directions/tech-diag";
import type { ExpertiseType } from "@/source/entities/expertise";
import type { PartySuggestion } from "@/source/entities/party";
import type { LicenseHolderFiles, UserRole } from "@/source/entities/user";
import type { LicenseRentalKind } from "@/source/shared/ui/RentalPriceField";
import type { SelectedLocation } from "@/source/shared/ui/YandexMap";
import type { DirectionFiles } from "./directionFiles";

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

export type ConsentKey = "privacy" | "terms" | "personal";
export type DocFileKey = "cadastralDiploma" | "cadastralCertificate" | "forensicDiploma";
export type DocListKey =
  | "auditDocuments"
  | "cadastralDocuments"
  | "forensicDocuments"
  | "techDiagDocuments"
  | "designEducationDocuments"
  | "designNokDocuments"
  | "designNrsDocuments"
  | "designQualificationDocuments"
  | "designRtnDocuments"
  | "ecologyDocuments"
  | "surveyEducationDocuments"
  | "surveyNokDocuments"
  | "surveyNrsDocuments"
  | "surveyQualificationDocuments"
  | "surveyRtnDocuments";

export interface RegisterState {
  isSubmitting: boolean;
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
  directions: string[];
  expertiseProfile: ExpertiseProfile | null;
  auditExpertProfile: AuditExpertProfile | null;
  auditCustomerProfile: AuditCustomerProfile | null;
  auditHolderProfile: AuditLicenseHolderProfile | null;
  cadastralProfile: CadastralProfile | null;
  forensicProfile: ForensicProfile | null;
  researchProfile: ResearchProfile | null;
  laboratoryProfile: LaboratoryProfile | null;
  techDiagProfile: TechDiagProfile | null;
  techDiagHolderProfile: TechDiagHolderProfile | null;
  designProfile: DesignProfile | null;
  designHolderProfile: SroHolderProfile | null;
  ecologyProfile: EcologyProfile | null;
  surveyProfile: SurveyProfile | null;
  surveyHolderProfile: SroHolderProfile | null;
  directionFiles: DirectionFiles;
  licenseEnabled: boolean;
  licenseNumber: string;
  licenseAreas: ExpertiseType[];
  rentalKind: LicenseRentalKind;
  rentalPercent: string;
  rentalFixed: string;
  miningNumber: string;
  labNumber: string;
  files: LicenseHolderFiles;
  consents: Record<ConsentKey, boolean>;
}

export type RegisterAction =
  | { type: "submit/start" }
  | { type: "submit/finish" }
  | { type: "set"; key: StringField; value: string }
  | { type: "role"; value: UserRole }
  | { type: "travels"; value: boolean }
  | { type: "showOnMap"; value: boolean }
  | { type: "mapFields"; value: string[] }
  | { type: "contactEnabled"; value: boolean }
  | { type: "contactConsent"; value: boolean }
  | { type: "location"; point: SelectedLocation | null }
  | { type: "party"; party: PartySuggestion }
  | { type: "companyText"; value: string }
  | { type: "direction"; key: string; value: boolean }
  | { type: "expertise"; value: ExpertiseProfile | null }
  | { type: "auditExpert"; value: AuditExpertProfile | null }
  | { type: "auditCustomer"; value: AuditCustomerProfile | null }
  | { type: "auditHolder"; value: AuditLicenseHolderProfile | null }
  | { type: "cadastral"; value: CadastralProfile | null }
  | { type: "forensic"; value: ForensicProfile | null }
  | { type: "research"; value: ResearchProfile | null }
  | { type: "laboratory"; value: LaboratoryProfile | null }
  | { type: "techDiag"; value: TechDiagProfile | null }
  | { type: "techDiagHolder"; value: TechDiagHolderProfile | null }
  | { type: "design"; value: DesignProfile | null }
  | { type: "designHolder"; value: SroHolderProfile | null }
  | { type: "ecology"; value: EcologyProfile | null }
  | { type: "survey"; value: SurveyProfile | null }
  | { type: "surveyHolder"; value: SroHolderProfile | null }
  | { type: "licenseEnabled"; value: boolean }
  | { type: "areas"; value: ExpertiseType[] }
  | { type: "rentalKind"; value: LicenseRentalKind }
  | { type: "file"; key: keyof LicenseHolderFiles; file: File | null }
  | { type: "docFile"; key: DocFileKey; file: File | null }
  | { type: "docAdd"; key: DocListKey; files: File[] }
  | { type: "docRemove"; key: DocListKey; file: File }
  | { type: "consent"; key: ConsentKey; value: boolean };
