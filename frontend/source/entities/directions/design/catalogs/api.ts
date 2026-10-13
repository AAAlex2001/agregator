import { send } from "@/source/shared/api/request";
import type { DesignCatalogs } from "./types";

/** Справочники проектирования: специальности, области РТН, категории и виды документации, согласования. */
export async function fetchDesignCatalogs(): Promise<DesignCatalogs> {
  const response = await send("/directions/design/catalogs", {}, "Не удалось загрузить справочники направления");
  return response.json();
}
