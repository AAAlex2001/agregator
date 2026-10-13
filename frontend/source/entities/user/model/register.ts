import type {
  AuditCustomerProfile,
  AuditExpertProfile,
  AuditLicenseHolderProfile,
} from "@/source/entities/directions/audit";
import type { CadastralProfile } from "@/source/entities/directions/cadastral";
import type { DesignProfile } from "@/source/entities/directions/design";
import type { SroHolderPayload } from "@/source/entities/directions/shared";
import type { EcologyProfile } from "@/source/entities/directions/ecology";
import type { ExpertiseProfile } from "@/source/entities/directions/expertise";
import type { ForensicProfile } from "@/source/entities/directions/forensic";
import type { LaboratoryProfile } from "@/source/entities/directions/laboratory";
import type { ResearchProfile } from "@/source/entities/directions/research";
import type { SurveyProfile } from "@/source/entities/directions/survey";
import type { TechDiagHolderProfile, TechDiagProfile } from "@/source/entities/directions/tech-diag";
import type { LicenseRentalKind } from "@/source/shared/ui/RentalPriceField";
import type { CompanyData, UserRole } from "./types";

export interface AccountPayload {
  email: string;
  password: string;
  password_confirm: string;
  phone?: string;
  privacy_consent: boolean;
  terms_consent: boolean;
  personal_data_consent: boolean;
}

export interface CustomerRegisterPayload extends AccountPayload {
  role: "CUSTOMER";
  first_name?: string;
  last_name?: string;
  inn: string;
  company_data: CompanyData;
  audit_customer_profile: AuditCustomerProfile | null;
  directions: string[];
}

export interface ExpertRegisterPayload extends AccountPayload {
  role: "EXPERT";
  referral_code?: string;
  first_name?: string;
  last_name?: string;
  location_lat: number | null;
  location_lng: number | null;
  location_address: string | null;
  location_city: string | null;
  travels_to_other_regions: boolean;
  show_on_map: boolean;
  map_fields: string[];
  expertise_profile: ExpertiseProfile | null;
  audit_expert_profile: AuditExpertProfile | null;
  cadastral_profile: CadastralProfile | null;
  forensic_profile: ForensicProfile | null;
  research_profile: ResearchProfile | null;
  laboratory_profile: LaboratoryProfile | null;
  tech_diag_profile: TechDiagProfile | null;
  design_profile: DesignProfile | null;
  ecology_profile: EcologyProfile | null;
  survey_profile: SurveyProfile | null;
  contact_sales_enabled: boolean;
  contact_price_rubles?: number;
  contact_payment_details?: string;
  contact_disclosure_consent: boolean;
}

export interface LicenseHolderRegisterPayload extends AccountPayload {
  inn: string;
  company_data: CompanyData;
  license_number: string;
  license_areas: string[];
  license_rental_kind: LicenseRentalKind | null;
  license_rental_percent?: number;
  license_rental_fixed_amount?: number;
  mining_license_number: string | null;
  lab_accreditation_number: string | null;
  audit_profile: AuditLicenseHolderProfile | null;
  tech_diag_profile: TechDiagHolderProfile | null;
  design_profile: SroHolderPayload | null;
  survey_profile: SroHolderPayload | null;
  directions: string[];
}

export type ExpertDocumentSlot =
  | "AUDIT_SUPB"
  | "CADASTRAL_DIPLOMA"
  | "CADASTRAL_CERTIFICATE"
  | "CADASTRAL"
  | "FORENSIC_DIPLOMA"
  | "FORENSIC"
  | "TECH_DIAG"
  | "DESIGN_EDUCATION"
  | "DESIGN_NOK"
  | "DESIGN_NRS"
  | "DESIGN_QUALIFICATION"
  | "DESIGN_RTN"
  | "ECOLOGY"
  | "SURVEY_EDUCATION"
  | "SURVEY_NOK"
  | "SURVEY_NRS"
  | "SURVEY_QUALIFICATION"
  | "SURVEY_RTN";

export interface ExpertDocument {
  slot: ExpertDocumentSlot;
  file: File;
}

export interface LicenseHolderFiles {
  license: File | null;
  mining: File | null;
  sroDesign: File | null;
  sroSurvey: File | null;
  lab: File | null;
}

export interface RegisterResponse {
  id: number;
  role: UserRole;
  email: string | null;
  phone: string | null;
  created_at: string;
}
