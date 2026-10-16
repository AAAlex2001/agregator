import type { OrderApplicant } from "./applicant";

/** Предмет судебной экспертизы и требования к её исполнителю. */
export interface ForensicOrderDetails extends OrderApplicant {
  expertise_purpose: string;
  government_body: string;
  city: string;
  education_requirement: string;
  extra_requirements: string;
  similar_experience_required: boolean;
  duration: string;
}
