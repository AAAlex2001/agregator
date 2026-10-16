import type { ExpertiseProfileValues } from "./types";

/** Создаёт отдельную анкету ЭПБ без удостоверений. */
export function createExpertiseProfileValues(): ExpertiseProfileValues {
  return { certificates: [] };
}
