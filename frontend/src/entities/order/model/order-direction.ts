import type { AuditOrderDetails } from "./details/audit";
import type { CadastralOrderDetails } from "./details/cadastral";
import type { DesignOrderDetails } from "./details/design";
import type { EcologyOrderDetails } from "./details/ecology";
import type { ForensicOrderDetails } from "./details/forensic";
import type { LaboratoryOrderDetails } from "./details/laboratory";
import type { ResearchOrderDetails } from "./details/research";
import type { SurveyOrderDetails } from "./details/survey";
import type { TechDiagOrderDetails } from "./details/tech-diag";

/** Направление заказа определяет точный набор его дополнительных условий. */
export type OrderDirection =
  | { work_type: "EXPERTISE" | "RESEARCH_LAB"; details: null }
  | { work_type: "AUDIT_SUPB"; details: AuditOrderDetails | null }
  | { work_type: "CADASTRAL"; details: CadastralOrderDetails | null }
  | { work_type: "DESIGN"; details: DesignOrderDetails | null }
  | { work_type: "ECOLOGY"; details: EcologyOrderDetails | null }
  | { work_type: "FORENSIC"; details: ForensicOrderDetails | null }
  | { work_type: "LABORATORY"; details: LaboratoryOrderDetails | null }
  | { work_type: "RESEARCH"; details: ResearchOrderDetails | null }
  | { work_type: "SURVEY"; details: SurveyOrderDetails | null }
  | { work_type: "TECH_DIAG"; details: TechDiagOrderDetails | null };
