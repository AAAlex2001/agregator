export interface CatalogOption {
  code: string;
  title: string;
}

/** Пункт справочника с коротким обозначением: «ИГИ», «АР». */
export interface ShortCatalogOption extends CatalogOption {
  short: string;
}
