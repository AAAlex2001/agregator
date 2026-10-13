import type { CatalogOption } from "../../shared/model/catalog";

export interface TechDiagCatalogs {
  methods: CatalogOption[];
  control_objects: CatalogOption[];
}

export const emptyTechDiagCatalogs: TechDiagCatalogs = {
  methods: [],
  control_objects: [],
};
