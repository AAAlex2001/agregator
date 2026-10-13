import type { CatalogOption, ShortCatalogOption } from "../../shared/model/catalog";

export interface SurveyCatalogs {
  kinds: ShortCatalogOption[];
  rtn_areas: CatalogOption[];
}

export const emptySurveyCatalogs: SurveyCatalogs = {
  kinds: [],
  rtn_areas: [],
};
