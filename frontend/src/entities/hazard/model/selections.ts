import type { HazardCatalog, HazardSelections } from "./types";

/** Ставит каждому фактору справочника его значение по умолчанию. */
export function getDefaultSelections(catalog: HazardCatalog): HazardSelections {
  const factors = catalog.groups.flatMap((group) => group.factors);

  return Object.fromEntries(
    factors.map((factor) => [factor.code, factor.default_value]),
  );
}
