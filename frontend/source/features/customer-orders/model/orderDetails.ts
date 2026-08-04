import type { OrderWorkType } from "@/source/entities/order";
import {
  auditOrderSchema,
  emptyAuditOrderDetails,
  type AuditOrderDetails,
} from "@/source/features/directions/audit";
import {
  cadastralOrderSchema,
  emptyCadastralOrderDetails,
  type CadastralOrderDetails,
} from "@/source/features/directions/cadastral";
import {
  emptyForensicOrderDetails,
  forensicOrderSchema,
  type ForensicOrderDetails,
} from "@/source/features/directions/forensic";
import {
  emptyLaboratoryOrderDetails,
  laboratoryOrderSchema,
  type LaboratoryOrderDetails,
} from "@/source/features/directions/laboratory";
import {
  emptyResearchOrderDetails,
  researchOrderSchema,
  type ResearchOrderDetails,
} from "@/source/features/directions/research";
import { firstSchemaError } from "@/source/features/directions/shared/model/validate";

const DIRECTIONS_WITH_DETAILS: OrderWorkType[] = [
  "CADASTRAL",
  "FORENSIC",
  "RESEARCH",
  "LABORATORY",
  "AUDIT_SUPB",
];

export function hasOrderDetails(workType: OrderWorkType): boolean {
  return DIRECTIONS_WITH_DETAILS.includes(workType);
}

export interface DirectionDetailsValues {
  cadastralDetails: CadastralOrderDetails;
  forensicDetails: ForensicOrderDetails;
  researchDetails: ResearchOrderDetails;
  laboratoryDetails: LaboratoryOrderDetails;
  auditDetails: AuditOrderDetails;
}

export function emptyDirectionDetails(): DirectionDetailsValues {
  return structuredClone({
    cadastralDetails: emptyCadastralOrderDetails,
    forensicDetails: emptyForensicOrderDetails,
    researchDetails: emptyResearchOrderDetails,
    laboratoryDetails: emptyLaboratoryOrderDetails,
    auditDetails: emptyAuditOrderDetails,
  });
}

function merge<T extends object>(empty: T, incoming: object): T {
  return { ...empty, ...incoming };
}

export function directionDetailsFromServer(
  workType: OrderWorkType,
  incoming: object | null | undefined,
): DirectionDetailsValues {
  const values = emptyDirectionDetails();
  if (!incoming) return values;
  if (workType === "CADASTRAL") values.cadastralDetails = merge(values.cadastralDetails, incoming);
  if (workType === "FORENSIC") values.forensicDetails = merge(values.forensicDetails, incoming);
  if (workType === "RESEARCH") values.researchDetails = merge(values.researchDetails, incoming);
  if (workType === "LABORATORY") values.laboratoryDetails = merge(values.laboratoryDetails, incoming);
  if (workType === "AUDIT_SUPB") values.auditDetails = merge(values.auditDetails, incoming);
  return values;
}

export function activeDirectionDetails(
  workType: OrderWorkType,
  values: DirectionDetailsValues,
): object | undefined {
  switch (workType) {
    case "CADASTRAL":
      return values.cadastralDetails;
    case "FORENSIC":
      return values.forensicDetails;
    case "RESEARCH":
      return values.researchDetails;
    case "LABORATORY":
      return values.laboratoryDetails;
    case "AUDIT_SUPB":
      return values.auditDetails;
    default:
      return undefined;
  }
}

export interface DirectionDetailsIssue {
  path: keyof DirectionDetailsValues;
  message: string;
}

export function validateDirectionDetails(
  workType: OrderWorkType,
  values: DirectionDetailsValues,
): DirectionDetailsIssue | null {
  switch (workType) {
    case "CADASTRAL": {
      const message = firstSchemaError(cadastralOrderSchema, values.cadastralDetails);
      return message ? { path: "cadastralDetails", message } : null;
    }
    case "FORENSIC": {
      const message = firstSchemaError(forensicOrderSchema, values.forensicDetails);
      return message ? { path: "forensicDetails", message } : null;
    }
    case "RESEARCH": {
      const message = firstSchemaError(researchOrderSchema, values.researchDetails);
      return message ? { path: "researchDetails", message } : null;
    }
    case "LABORATORY": {
      const message = firstSchemaError(laboratoryOrderSchema, values.laboratoryDetails);
      return message ? { path: "laboratoryDetails", message } : null;
    }
    case "AUDIT_SUPB": {
      const message = firstSchemaError(auditOrderSchema, values.auditDetails);
      return message ? { path: "auditDetails", message } : null;
    }
    default:
      return null;
  }
}
