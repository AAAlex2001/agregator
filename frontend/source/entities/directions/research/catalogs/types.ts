import type { CatalogOption } from "../../shared/model/catalog";

export interface ResearchCatalogs {
  academic_degrees: CatalogOption[];
  science_branches: CatalogOption[];
  academic_titles: CatalogOption[];
}

export const emptyResearchCatalogs: ResearchCatalogs = {
  academic_degrees: [],
  science_branches: [],
  academic_titles: [],
};
