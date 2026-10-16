import type { LiningCriteriaSection, LiningCriterion } from "./types";

/** Делит условия надёжности на разделы в порядке их первого появления. */
export function getCriteriaSections(criteria: LiningCriterion[]): LiningCriteriaSection[] {
  const titles = [...new Set(criteria.map((criterion) => criterion.section))];

  return titles.map((title) => ({
    title,
    criteria: criteria.filter((criterion) => criterion.section === title),
  }));
}
