import { request } from "@/shared/api/request";
import type { DesignOptions } from "../model/types";

/** Загружает специальности проектирования и области аттестации РТН. */
export async function getDesignOptions(signal?: AbortSignal): Promise<DesignOptions> {
  const response = await request("/directions/design/catalogs", {
    signal,
    errorMessage: "Не удалось загрузить варианты для анкеты проектировщика.",
  });

  return response.json();
}
