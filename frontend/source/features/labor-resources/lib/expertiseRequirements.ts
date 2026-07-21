import type { LaborCertificate } from "@/source/entities/labor";
import type { ExpertiseType } from "@/source/entities/expertise";
import type { LaborExpertiseMode } from "../model/types";

interface BuildExpertiseRequirementsParams {
  mode: LaborExpertiseMode;
  certificateCodes: string[];
  expertiseTypes: ExpertiseType[];
  category: string;
}

function exactRequirement(
  code: string,
  category: string,
): LaborCertificate {
  const [area, ...objectParts] = code.trim().split(/\s+/);

  return {
    area,
    object: objectParts.join(" "),
    category: category || undefined,
  };
}

function generalRequirement(
  object: ExpertiseType,
  category: string,
): LaborCertificate {
  return {
    object,
    category: category || undefined,
  };
}

export function buildExpertiseRequirements({
  mode,
  certificateCodes,
  expertiseTypes,
  category,
}: BuildExpertiseRequirementsParams): LaborCertificate[] {
  if (mode === "EXACT") {
    return certificateCodes.map((code) =>
      exactRequirement(code, category),
    );
  }

  return expertiseTypes.map((object) =>
    generalRequirement(object, category),
  );
}
