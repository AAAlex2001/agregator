import type {
  LaborCertificate,
  LaborListingKind,
  LaborListingRequest,
} from "@/entities/labor";
import type { LaborListingFields } from "./types";

/** Берёт удостоверения из профиля, иначе собирает требования из выбранных кодов или видов. */
function getCertificates(
  fields: LaborListingFields,
  profileCertificates: LaborCertificate[],
): LaborCertificate[] {
  const category = fields.category || null;

  if (profileCertificates.length > 0) {
    return profileCertificates;
  }

  if (fields.otherProfession) {
    return [];
  }

  if (fields.expertiseMode === "GENERAL") {
    return fields.expertiseTypes.map((type) => ({
      area: null,
      object: type,
      category,
    }));
  }

  return fields.certificateCodes.map((code) => {
    const [area, object] = code.split(" ");

    return {
      area,
      object,
      category,
    };
  });
}

/** Переводит черновик в данные API с учётом вида объявления. */
export function createLaborListingRequest(
  kind: LaborListingKind,
  fields: LaborListingFields,
  region: string,
  profileCertificates: LaborCertificate[],
): LaborListingRequest {
  const isExpert = kind === "EXPERT_AVAILABLE";

  return {
    kind,
    certificates: getCertificates(fields, profileCertificates),
    other_profession: fields.otherProfession ? fields.otherProfessionText.trim() : null,
    region: region.trim(),
    employment_term: fields.term,
    fixed_term: fields.term === "FIXED" ? fields.fixedTerm.trim() : null,
    start_date: isExpert ? null : fields.startDate.slice(0, 10),
    employment_type: isExpert ? null : fields.employmentType,
    current_job_status: isExpert ? fields.jobStatus : null,
  };
}
