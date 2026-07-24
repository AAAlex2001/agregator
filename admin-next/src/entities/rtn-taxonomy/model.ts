export type TaxonomyOption = { value: string; label: string };

export type RtnTaxonomy = {
  oversightAreas: TaxonomyOption[];
  industries: TaxonomyOption[];
  activities: TaxonomyOption[];
  objectTypes: TaxonomyOption[];
  documentTypes: TaxonomyOption[];
  statuses: TaxonomyOption[];
};
