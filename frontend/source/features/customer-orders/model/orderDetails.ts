import type { OrderWorkType } from "@/source/entities/order";
import { emptyAuditOrderDetails, type AuditOrderDetails } from "@/source/features/directions/audit";
import {
  emptyCadastralOrderDetails,
  type CadastralOrderDetails,
} from "@/source/features/directions/cadastral";
import {
  emptyDesignOrderDetails,
  type DesignOrderDetails,
} from "@/source/features/directions/design";
import {
  emptyEcologyOrderDetails,
  type EcologyOrderDetails,
} from "@/source/features/directions/ecology";
import {
  emptyForensicOrderDetails,
  type ForensicOrderDetails,
} from "@/source/features/directions/forensic";
import {
  emptyLaboratoryOrderDetails,
  type LaboratoryOrderDetails,
} from "@/source/features/directions/laboratory";
import {
  emptyResearchOrderDetails,
  type ResearchOrderDetails,
} from "@/source/features/directions/research";
import {
  emptyTechDiagOrderDetails,
  type TechDiagOrderDetails,
} from "@/source/features/directions/tech-diag";

export interface DirectionDetailsValues {
  cadastralDetails: CadastralOrderDetails;
  forensicDetails: ForensicOrderDetails;
  researchDetails: ResearchOrderDetails;
  laboratoryDetails: LaboratoryOrderDetails;
  auditDetails: AuditOrderDetails;
  techDiagDetails: TechDiagOrderDetails;
  designDetails: DesignOrderDetails;
  ecologyDetails: EcologyOrderDetails;
}

const DETAILS_KEYS: Partial<Record<OrderWorkType, keyof DirectionDetailsValues>> = {
  CADASTRAL: "cadastralDetails",
  FORENSIC: "forensicDetails",
  RESEARCH: "researchDetails",
  LABORATORY: "laboratoryDetails",
  AUDIT_SUPB: "auditDetails",
  TECH_DIAG: "techDiagDetails",
  DESIGN: "designDetails",
  ECOLOGY: "ecologyDetails",
};

export function hasOrderDetails(workType: OrderWorkType): boolean {
  return workType in DETAILS_KEYS;
}

export function emptyDirectionDetails(): DirectionDetailsValues {
  return structuredClone({
    cadastralDetails: emptyCadastralOrderDetails,
    forensicDetails: emptyForensicOrderDetails,
    researchDetails: emptyResearchOrderDetails,
    laboratoryDetails: emptyLaboratoryOrderDetails,
    auditDetails: emptyAuditOrderDetails,
    techDiagDetails: emptyTechDiagOrderDetails,
    designDetails: emptyDesignOrderDetails,
    ecologyDetails: emptyEcologyOrderDetails,
  });
}

export function directionDetailsFromServer(
  workType: OrderWorkType,
  incoming: object | null | undefined,
): DirectionDetailsValues {
  const values = emptyDirectionDetails();
  const key = DETAILS_KEYS[workType];
  if (!key || !incoming) return values;
  return { ...values, [key]: { ...values[key], ...incoming } };
}

export function activeDirectionDetails(
  workType: OrderWorkType,
  values: DirectionDetailsValues,
): object | undefined {
  const key = DETAILS_KEYS[workType];
  return key ? values[key] : undefined;
}
