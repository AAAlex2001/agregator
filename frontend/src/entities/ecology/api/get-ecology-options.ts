import { request } from "@/shared/api/request";
import type { EcologyOptions } from "../model/types";

/** Загружает виды экологических работ. */
export async function getEcologyOptions(): Promise<EcologyOptions> {
  const response = await request("/directions/ecology/catalogs", {
    errorMessage: "Не удалось загрузить справочник направления",
  });

  return response.json();
}
