import type { OrderApplicant } from "./applicant";

/** Работа и требования к исполнителю кадастрового заказа. */
export interface CadastralOrderDetails extends OrderApplicant {
  work_purpose: string;
  city: string;
  education_requirement: string;
  sro_required: boolean;
  duration: string;
}
