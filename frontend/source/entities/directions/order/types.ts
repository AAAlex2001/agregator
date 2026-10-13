import type { OrderWorkType } from "@/source/entities/order";
import { emptyAuditOrderDetails, type AuditOrderDetails } from "../audit";
import { emptyCadastralOrderDetails, type CadastralOrderDetails } from "../cadastral";
import { emptyDesignOrderDetails, type DesignOrderDetails } from "../design";
import { emptyEcologyOrderDetails, type EcologyOrderDetails } from "../ecology";
import { emptyForensicOrderDetails, type ForensicOrderDetails } from "../forensic";
import { emptyLaboratoryOrderDetails, type LaboratoryOrderDetails } from "../laboratory";
import { emptyResearchOrderDetails, type ResearchOrderDetails } from "../research";
import { emptySurveyOrderDetails, type SurveyOrderDetails } from "../survey";
import { emptyTechDiagOrderDetails, type TechDiagOrderDetails } from "../tech-diag";

export type DirectionOrderDetails =
  | AuditOrderDetails
  | CadastralOrderDetails
  | DesignOrderDetails
  | EcologyOrderDetails
  | ForensicOrderDetails
  | LaboratoryOrderDetails
  | ResearchOrderDetails
  | SurveyOrderDetails
  | TechDiagOrderDetails;

const EMPTY: Partial<Record<OrderWorkType, DirectionOrderDetails>> = {
  AUDIT_SUPB: emptyAuditOrderDetails,
  CADASTRAL: emptyCadastralOrderDetails,
  DESIGN: emptyDesignOrderDetails,
  ECOLOGY: emptyEcologyOrderDetails,
  FORENSIC: emptyForensicOrderDetails,
  LABORATORY: emptyLaboratoryOrderDetails,
  RESEARCH: emptyResearchOrderDetails,
  SURVEY: emptySurveyOrderDetails,
  TECH_DIAG: emptyTechDiagOrderDetails,
};

/** Пустая анкета заказа для направления; у экспертизы анкеты нет — null. */
export function emptyOrderDetails(workType: OrderWorkType): DirectionOrderDetails | null {
  const empty = EMPTY[workType];
  return empty ? structuredClone(empty) : null;
}
