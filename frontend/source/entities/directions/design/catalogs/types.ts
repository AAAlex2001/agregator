import type { CatalogOption, ShortCatalogOption } from "../../shared/model/catalog";

export interface DesignCatalogs {
  specialties: ShortCatalogOption[];
  rtn_areas: CatalogOption[];
  doc_categories: CatalogOption[];
  documentation_kinds: CatalogOption[];
  approvals: CatalogOption[];
}

export const emptyDesignCatalogs: DesignCatalogs = {
  specialties: [],
  rtn_areas: [],
  doc_categories: [],
  documentation_kinds: [],
  approvals: [],
};
