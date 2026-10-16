import type { OrderApplicant } from "./applicant";

/** Требования к оборудованию для лабораторных исследований. */
export interface LaboratoryOrderDetails extends OrderApplicant {
  equipment_requirements: string;
}
