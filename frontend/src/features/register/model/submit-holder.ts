import type { AuditHolderProfileValues } from "@/entities/audit";
import type { CompanySuggestion } from "@/entities/company";
import type { DirectionCode } from "@/entities/direction";
import type { ExpertiseType } from "@/entities/expertise";
import type { LicenseRentalKind } from "@/entities/license-holder";
import { toSroProfilePayload } from "@/entities/sro";
import type { SroProfilePayload } from "@/entities/sro";
import type { TechDiagHolderProfile } from "@/entities/tech-diag";
import { registerLicenseHolder } from "@/entities/user";
import type { RegistrationAccount } from "./account";
import { getAccountRequestFields } from "./account-request";
import type { RegistrationAccountRequest } from "./account-request";
import type { HolderRegistration } from "./holder";

/** Payload держателя: числовые условия лицензии и СРО в контракте API. */
interface HolderRegistrationRequest extends RegistrationAccountRequest {
  inn: string;
  company_data: CompanySuggestion;
  license_number: string;
  license_areas: ExpertiseType[];
  license_rental_kind: LicenseRentalKind | null;
  license_rental_percent?: number;
  license_rental_fixed_amount?: number;
  mining_license_number: string | null;
  lab_accreditation_number: string | null;
  audit_profile: AuditHolderProfileValues | null;
  tech_diag_profile: TechDiagHolderProfile | null;
  design_profile: SroProfilePayload | null;
  survey_profile: SroProfilePayload | null;
  directions: DirectionCode[];
}

/** Регистрирует держателя с отдельными multipart-полями разрешительных документов. */
export async function submitHolder(
  account: RegistrationAccount,
  holder: HolderRegistration,
  company: CompanySuggestion,
): Promise<void> {
  const license = holder.license;
  const documents = holder.regulatoryDocuments;
  const payload: HolderRegistrationRequest = {
    ...getAccountRequestFields(account),
    inn: company.data.inn ?? "",
    company_data: company,
    license_number: license.enabled ? license.number.trim() : "",
    license_areas: license.enabled ? license.areas : [],
    license_rental_kind: license.enabled ? license.rentalKind : null,
    license_rental_percent: license.enabled && license.rentalKind === "PERCENT"
      ? Number(license.rentalPercent.replace(",", "."))
      : undefined,
    license_rental_fixed_amount: license.enabled && license.rentalKind === "FIXED"
      ? Number(license.rentalFixed.replace(/\s/g, ""))
      : undefined,
    mining_license_number: documents.miningNumber.trim() || null,
    lab_accreditation_number: documents.laboratoryNumber.trim() || null,
    audit_profile: holder.audit,
    tech_diag_profile: holder.techDiag,
    design_profile: holder.design ? toSroProfilePayload(holder.design) : null,
    survey_profile: holder.survey ? toSroProfilePayload(holder.survey) : null,
    directions: holder.directions,
  };
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));

  if (license.file) {
    form.append("license_file", license.file.file);
  }

  if (documents.miningFile) {
    form.append("mining_license_file", documents.miningFile.file);
  }

  if (documents.sroDesignFile) {
    form.append("sro_design_file", documents.sroDesignFile.file);
  }

  if (documents.sroSurveyFile) {
    form.append("sro_survey_file", documents.sroSurveyFile.file);
  }

  if (documents.laboratoryFile) {
    form.append("lab_accreditation_file", documents.laboratoryFile.file);
  }

  await registerLicenseHolder(form);
}

