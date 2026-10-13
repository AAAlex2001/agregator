import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface ResearchOrderDetails extends ApplicantBlock {
  executor_requirements: string[];
  needs_site_visit: boolean;
}

export const emptyResearchOrderDetails: ResearchOrderDetails = {
  ...emptyApplicant,
  executor_requirements: [""],
  needs_site_visit: false,
};
