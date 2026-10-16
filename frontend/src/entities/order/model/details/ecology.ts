import type { OrderApplicant } from "./applicant";

/** Виды работ в заказе на экологическое сопровождение. */
export interface EcologyOrderDetails extends OrderApplicant {
  work_types: string[];
}
