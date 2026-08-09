import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface ResearchProfile {
  academic_degree: string;
  academic_title: string;
  research_field: string;
}

export interface ResearchOrderDetails extends ApplicantBlock {
  executor_requirements: string[];
  needs_site_visit: boolean;
}

export const emptyResearchProfile: ResearchProfile = {
  academic_degree: "",
  academic_title: "",
  research_field: "",
};

export const emptyResearchOrderDetails: ResearchOrderDetails = {
  ...emptyApplicant,
  executor_requirements: [""],
  needs_site_visit: false,
};
