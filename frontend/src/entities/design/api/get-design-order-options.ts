import { request } from "@/shared/api/request";
import type { DesignOrderOptions } from "../model/types";

/** Загружает документацию, разделы и согласования для заказа на проектирование. */
export async function getDesignOrderOptions(): Promise<DesignOrderOptions> {
  const response = await request("/directions/design/catalogs", {
    errorMessage: "Не удалось загрузить справочники направления",
  });

  return response.json();
}
