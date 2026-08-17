import { emptyApplicant, type ApplicantBlock } from "../../shared/model/applicant";

export interface ResearchCatalogOption {
  code: string;
  title: string;
}

export interface ResearchCatalogs {
  academic_degrees: ResearchCatalogOption[];
  science_branches: ResearchCatalogOption[];
  academic_titles: ResearchCatalogOption[];
}

export interface ResearchProfile {
  academic_degree: string;
  science_branch: string;
  academic_title: string;
  research_field: string;
}

export interface ResearchOrderDetails extends ApplicantBlock {
  executor_requirements: string[];
  needs_site_visit: boolean;
}

export const emptyResearchCatalogs: ResearchCatalogs = {
  academic_degrees: [],
  science_branches: [],
  academic_titles: [],
};

export const emptyResearchProfile: ResearchProfile = {
  academic_degree: "",
  science_branch: "",
  academic_title: "",
  research_field: "",
};

export const emptyResearchOrderDetails: ResearchOrderDetails = {
  ...emptyApplicant,
  executor_requirements: [""],
  needs_site_visit: false,
};
