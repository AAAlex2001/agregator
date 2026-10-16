import type { OrderApplicant } from "./applicant";

/** Требования к исполнителю НИР и необходимость выезда на объект. */
export interface ResearchOrderDetails extends OrderApplicant {
  executor_requirements: string[];
  needs_site_visit: boolean;
}
