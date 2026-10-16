import type { OrderApplicant } from "./applicant";

/** Виды инженерных изысканий, выбранные в заказе. */
export interface SurveyOrderDetails extends OrderApplicant {
  kinds: string[];
}
