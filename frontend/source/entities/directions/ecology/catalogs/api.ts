import { send } from "@/source/shared/api/request";
import type { EcologyCatalogs } from "./types";

/** Справочник видов экологических работ. */
export async function fetchEcologyCatalogs(): Promise<EcologyCatalogs> {
  const response = await send("/directions/ecology/catalogs", {}, "Не удалось загрузить справочник направления");
  return response.json();
}
