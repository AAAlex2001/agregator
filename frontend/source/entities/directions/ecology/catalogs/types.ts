import type { CatalogOption } from "../../shared/model/catalog";

export interface EcologyCatalogs {
  work_types: CatalogOption[];
}

export const emptyEcologyCatalogs: EcologyCatalogs = {
  work_types: [],
};
