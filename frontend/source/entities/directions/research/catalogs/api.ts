import { send } from "@/source/shared/api/request";
import type { ResearchCatalogs } from "./types";

/** Справочники НИР: учёные степени, звания, отрасли науки. */
export async function fetchResearchCatalogs(): Promise<ResearchCatalogs> {
  const response = await send("/directions/research/catalogs", {}, "Не удалось загрузить справочники направления");
  return response.json();
}
