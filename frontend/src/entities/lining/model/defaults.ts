import type {
  LiningCatalog,
  LiningElementCategories,
  LiningExpertScores,
  LiningSelections,
} from "./types";

/** Ставит каждому фактору риска его значение по умолчанию. */
export function getDefaultLiningSelections(catalog: LiningCatalog): LiningSelections {
  const factors = catalog.groups.flatMap((group) => group.factors);

  return Object.fromEntries(
    factors.map((factor) => [factor.code, factor.default_value]),
  );
}

/** Считает все элементы крепи исправными: первая категория состояния. */
export function getDefaultElementCategories(catalog: LiningCatalog): LiningElementCategories {
  return Object.fromEntries(
    catalog.elements.map((element) => [String(element.id), 1]),
  );
}

/** Ставит каждому условию надёжности начальный балл 1. */
export function getDefaultExpertScores(catalog: LiningCatalog): LiningExpertScores {
  return Object.fromEntries(
    catalog.expert_criteria.map((criterion) => [String(criterion.id), 1]),
  );
}
