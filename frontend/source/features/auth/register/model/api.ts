import { API_URL } from "@/source/shared/api/config";
import { readErrorMessage } from "@/source/shared/api/errorMessage";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";
import type {
  CompanyData,
  LicenseHolderRegisterPayload,
  RegisterResponse,
  UserRole,
} from "@/source/entities/user";
import type { AuditCustomerProfile, AuditExpertProfile } from "@/source/features/directions/audit";
import type { CadastralProfile } from "@/source/features/directions/cadastral";
import type { ExpertiseProfile } from "@/source/features/directions/expertise";
import type { ForensicProfile } from "@/source/features/directions/forensic";
import type { LaboratoryProfile } from "@/source/features/directions/laboratory";
import type { ResearchProfile } from "@/source/features/directions/research";
import type { TechDiagProfile } from "@/source/features/directions/tech-diag";

export interface RegisterPayload {
  role: UserRole;
  email: string;
  password: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  inn?: string;
  company_data?: CompanyData | null;
  location_lat?: number | null;
  location_lng?: number | null;
  location_address?: string | null;
  location_city?: string | null;
  travels_to_other_regions?: boolean;
  show_on_map?: boolean;
  map_fields?: string[];
  expertise_profile?: ExpertiseProfile | null;
  audit_expert_profile?: AuditExpertProfile | null;
  audit_customer_profile?: AuditCustomerProfile | null;
  cadastral_profile?: CadastralProfile | null;
  forensic_profile?: ForensicProfile | null;
  research_profile?: ResearchProfile | null;
  laboratory_profile?: LaboratoryProfile | null;
  tech_diag_profile?: TechDiagProfile | null;
  contact_sales_enabled?: boolean;
  contact_price_rubles?: number;
  contact_payment_details?: string;
  contact_disclosure_consent?: boolean;
  directions?: string[];
}

export type RegisterDocumentSlot =
  | "AUDIT_SUPB"
  | "CADASTRAL_DIPLOMA"
  | "CADASTRAL_CERTIFICATE"
  | "CADASTRAL"
  | "FORENSIC_DIPLOMA"
  | "FORENSIC"
  | "TECH_DIAG";

export interface RegisterDocument {
  slot: RegisterDocumentSlot;
  file: File;
}

export async function registerUser(
  payload: RegisterPayload,
  documents: RegisterDocument[] = [],
): Promise<RegisterResponse> {
  const res = await stableMultipartFetch({
    input: `${API_URL}/register/`,
    method: "POST",
    files: documents.map((document) => document.file),
    buildBody: () => {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      for (const document of documents) {
        formData.append("documents", document.file);
        formData.append("document_directions", document.slot);
      }
      return formData;
    },
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось зарегистрироваться"));
  return res.json();
}

export async function registerLicenseHolder(
  payload: LicenseHolderRegisterPayload,
  licenseFile: File | null,
  miningLicenseFile: File | null = null,
  sroDesignFile: File | null = null,
  labAccreditationFile: File | null = null,
): Promise<RegisterResponse> {
  const allFiles = [licenseFile, miningLicenseFile, sroDesignFile, labAccreditationFile].filter(
    (file): file is File => file !== null,
  );
  const res = await stableMultipartFetch({
    input: `${API_URL}/register/license-holder`,
    method: "POST",
    files: allFiles,
    buildBody: () => {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      if (licenseFile) formData.append("license_file", licenseFile);
      if (miningLicenseFile) formData.append("mining_license_file", miningLicenseFile);
      if (sroDesignFile) formData.append("sro_design_file", sroDesignFile);
      if (labAccreditationFile) formData.append("lab_accreditation_file", labAccreditationFile);
      return formData;
    },
  });
  if (!res.ok) throw new Error(await readErrorMessage(res, "Не удалось зарегистрироваться"));
  return res.json();
}
