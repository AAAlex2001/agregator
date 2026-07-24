import { RtnTaxonomy, TaxonomyOption } from "./model";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const toOptions = (raw: { value: string; label: string }[]): TaxonomyOption[] =>
  raw.map((option) => ({ value: option.value, label: option.label }));

export const loadTaxonomy = async (): Promise<RtnTaxonomy> => {
  const response = await fetch(`${base}/api/rtn/taxonomy`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить справочник фильтров");

  const data = await response.json();
  return {
    oversightAreas: toOptions(data.oversight_areas),
    industries: toOptions(data.industries),
    activities: toOptions(data.activities),
    objectTypes: toOptions(data.object_types),
    documentTypes: toOptions(data.document_types),
    statuses: toOptions(data.statuses),
  };
};
