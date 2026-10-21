import { request } from "@/shared/api/request";
import type { BlitzTariff } from "../model/types";

/** Ориентиры цены по парам «область × объект». */
export async function getBlitzTariffs(): Promise<BlitzTariff[]> {
  const response = await request("/blitz/tariffs", {
    errorMessage: "Не удалось загрузить тарифы",
  });

  return response.json();
}
