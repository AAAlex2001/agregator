export interface ResearchProfile {
  academic_degree: string;
  academic_title: string;
  research_field: string;
}

export interface ResearchOrderDetails {
  executor_requirements: string[];
  needs_site_visit: boolean;
}

export const emptyResearchProfile: ResearchProfile = {
  academic_degree: "",
  academic_title: "",
  research_field: "",
};

export const emptyResearchOrderDetails: ResearchOrderDetails = {
  executor_requirements: [""],
  needs_site_visit: false,
};
