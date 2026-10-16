import type { OrderApplicant } from "./applicant";

/** Цель, местоположение и срок технического диагностирования. */
export interface TechDiagOrderDetails extends OrderApplicant {
  purpose: string;
  object_city: string;
  duration: string;
}
