export interface ResearchProfile {
  academic_degree: string;
  science_branches: string[];
  academic_title: string;
  research_field: string;
}

export const emptyResearchProfile: ResearchProfile = {
  academic_degree: "",
  science_branches: [],
  academic_title: "",
  research_field: "",
};
